# Guia de Deployment no AWS Elastic Beanstalk

## 📋 RESUMO DOS PROBLEMAS ENCONTRADOS

### 🔴 CRÍTICOS (Impedem deployment):
1. **Procfile aponta para `catalogo.wsgi` mas o app é `projeto`**
2. **`.ebextensions/django.config` aponta para `catalogo`**
3. **`SECRET_KEY` hardcoded e exposto no repositório**
4. **Database SQLite - perdão dados entre deployments**
5. **Variáveis de ambiente não configuradas**

### 🟡 IMPORTANTES (Causam problemas em produção):
6. **ALLOWED_HOSTS = '*'** (muito permissivo)
7. **CORS_ALLOW_ALL_ORIGINS = True**
8. **Superuser criado automaticamente com senha fixa**
9. **Muitas dependências desnecessárias**
10. **Permissões de arquivo SQLite muito permissivas**

---

## 🚀 PASSOS PARA DEPLOYMENT

### PASSO 1: Corrigir Configurações Básicas

#### 1.1 - Atualizar Procfile
```bash
# Arquivo atual:
web: gunicorn catalogo.wsgi:application --bind 127.0.0.1:8000

# Deve ser:
web: gunicorn projeto.wsgi:application --bind 0.0.0.0:8000
```
**Mudanças:**
- `catalogo` → `projeto`
- `127.0.0.1` → `0.0.0.0` (Beanstalk precisa escutar em todas as interfaces)

#### 1.2 - Atualizar `.ebextensions/django.config`
Substituir:
- `catalogo/wsgi.py` → `projeto/wsgi.py`
- `catalogo.settings` → `projeto.settings`
- Remover comandos de criação automática de superuser

#### 1.3 - Atualizar `.elasticbeanstalk/config.yml`
```yaml
global:
  application_name: censo-amip  # Alterar de "catalogo-produtos"
  default_platform: Python 3.12
```

---

### PASSO 2: Configurar Segurança

#### 2.1 - Gerar nova SECRET_KEY
```python
# Em um terminal Python:
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

#### 2.2 - Atualizar settings.py
- Remover SECRET_KEY hardcoded
- Usar variáveis de ambiente
- Configurar ALLOWED_HOSTS dinamicamente
- Restringir CORS

**Usar o arquivo `settings_CORRIGIDO.py` como modelo**

---

### PASSO 3: Migrar do SQLite para PostgreSQL

#### 3.1 - Criar RDS no AWS
1. AWS Console → RDS → Create Database
2. Engine: PostgreSQL
3. Configurar:
   - DB Instance Identifier: `censo-amip-db`
   - Master username: `postgres`
   - Master password: [escolher senha forte]
   - Instance class: `db.t3.micro` (free tier)
   - Storage: 20 GB

#### 3.2 - Atualizar requirements.txt
```bash
# Adicionar:
psycopg2-binary==2.9.9
dj-database-url==3.0.0  # Já está no seu
python-dotenv==1.1.0
```

#### 3.3 - Exportar dados (se houver)
```bash
# Fazer backup do SQLite:
python manage.py dumpdata > backup.json

# Depois de migrar para PostgreSQL:
python manage.py loaddata backup.json
```

---

### PASSO 4: Configurar Variáveis de Ambiente

#### 4.1 - Criar arquivo `.env` local (para teste)
```bash
cp .env.example .env
# Editar .env com seus valores
```

#### 4.2 - Configurar no Elastic Beanstalk
AWS Console → Environment → Configuration → Software → Environment Properties

Adicionar:
```
DJANGO_SECRET_KEY = [seu-secret-key-gerado]
DJANGO_DEBUG = False
ALLOWED_HOSTS = seu-dominio.elasticbeanstalk.com,seu-dominio.com
DATABASE_URL = postgres://user:pass@seu-rds-endpoint:5432/censo_amip
CORS_ALLOWED_ORIGINS = https://seu-dominio.com
```

---

### PASSO 5: Preparar Static Files

#### 5.1 - Testar localmente
```bash
python manage.py collectstatic --noinput
```

#### 5.2 - Configurar no Beanstalk (opcional - para S3)
Se quiser usar S3 para servir estáticos:
```bash
pip install django-storages boto3
```

Adicionar em settings.py:
```python
if not DEBUG:
    STORAGES = {
        'default': {
            'BACKEND': 'storages.backends.s3boto3.S3Boto3Storage',
        },
        'staticfiles': {
            'BACKEND': 'storages.backends.s3boto3.S3StaticStorage',
        },
    }
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
```

---

### PASSO 6: Testes Pré-Deployment

#### 6.1 - Verificar problemas do Django
```bash
python manage.py check --deploy
```

#### 6.2 - Verificar migrações
```bash
python manage.py migrate --check
```

#### 6.3 - Executar testes (se tiver)
```bash
python manage.py test
```

#### 6.4 - Testar servidor localmente com configurações de produção
```bash
# Criar .env com DATABASE_URL apontando para banco de teste
DEBUG=False ALLOWED_HOSTS=localhost python manage.py runserver
```

---

### PASSO 7: Deploy

#### 7.1 - Fazer commit das mudanças
```bash
git add .
git commit -m "Prepare for AWS Elastic Beanstalk deployment"
```

#### 7.2 - Deploy com EB CLI
```bash
# Primeira vez:
eb create --envvars DJANGO_SECRET_KEY=seu-secret-key,DATABASE_URL=postgres://...

# Próximas vezes:
eb deploy
```

#### 7.3 - Verificar logs
```bash
eb logs
```

---

### PASSO 8: Pós-Deployment

#### 8.1 - Criar superuser
```bash
eb ssh
python manage.py createsuperuser
exit
```

#### 8.2 - Acessar admin
```
https://seu-dominio.elasticbeanstalk.com/admin/
```

#### 8.3 - Monitorar
```bash
eb status
eb logs -z  # Stream logs em tempo real
```

---

## ⚠️ CHECKLIST FINAL

- [ ] Procfile corrigido (projeto.wsgi)
- [ ] `.ebextensions/django.config` corrigido (projeto.settings)
- [ ] SECRET_KEY em variável de ambiente
- [ ] DEBUG = False
- [ ] ALLOWED_HOSTS específicos
- [ ] CORS configurado
- [ ] Database PostgreSQL criado (RDS)
- [ ] Variáveis de ambiente configuradas no Beanstalk
- [ ] `.env` adicionado ao `.gitignore`
- [ ] `python manage.py check --deploy` passa
- [ ] Estáticos testados localmente
- [ ] Backup do banco antes de migrar
- [ ] EB CLI instalado e configurado
- [ ] Primeira migração bem-sucedida
- [ ] Admin acessível após deploy

---

## 🔗 COMANDOS ÚTEIS

```bash
# Verificar status do environment
eb status

# Ver informações do environment
eb info

# SSH para o servidor
eb ssh

# Abrir aplicação no navegador
eb open

# Ver logs em tempo real
eb logs -z

# Fazer redeploy
eb deploy

# Parar o environment
eb terminate

# Criar nova variável de ambiente
eb setenv CHAVE=valor

# Ver variáveis de ambiente
eb printenv
```

---

## 📚 REFERÊNCIAS

- [Django Deployment on Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
- [EB CLI Reference](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)
