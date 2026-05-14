# Checklist de Deployment - AWS Elastic Beanstalk

## 🔴 CRÍTICO - ANTES DO DEPLOY

### 1. Corrigir Configurações do Beanstalk
- [ ] Atualizar `.ebextensions/django.config` (catalogo → projeto)
- [ ] Atualizar `Procfile` (catalogo → projeto)
- [ ] Atualizar `.elasticbeanstalk/config.yml` (catalogo-produtos → Censo_AMIP)

### 2. Segurança
- [ ] Remover SECRET_KEY do settings.py
- [ ] Usar variáveis de ambiente para SECRET_KEY, DEBUG, ALLOWED_HOSTS
- [ ] Configurar ALLOWED_HOSTS específicos para o domínio Beanstalk
- [ ] Restringir CORS para domínios específicos

### 3. Banco de Dados
- [ ] Migrar de SQLite para PostgreSQL (RDS)
- [ ] Adicionar `dj-database-url` ao requirements.txt (já está!)
- [ ] Configurar variáveis de ambiente para conexão RDS

### 4. Dependências
- [ ] Criar `requirements-prod.txt` sem ferramentas de desenvolvimento
- [ ] Remover: streamlit, mkdocs, matplotlib, pandas, seaborn, plotly, google-genai (se não usar)

### 5. Ambiente
- [ ] Criar arquivo `.env.example` com variáveis necessárias
- [ ] Configurar variáveis de ambiente no Beanstalk Console

---

## 🟡 IMPORTANTE - ANTES DO PRIMEIRO DEPLOY

### 6. Criar Superuser Seguro
- [ ] Remover comando de criação automática de superuser do django.config
- [ ] Usar comando manual após deploy: `eb ssh` → `python manage.py createsuperuser`

### 7. Estáticos e Mídia
- [ ] Configurar S3 para servir estáticos e média
- [ ] Instalar `django-storages` e `boto3`
- [ ] Configurar AWS_STORAGE_BUCKET_NAME no settings.py

### 8. Logs e Monitoramento
- [ ] Configurar CloudWatch para logs
- [ ] Testar coleta de logs antes de deploy

---

## 🟢 RECOMENDADO

### 9. Otimizações
- [ ] Adicionar cache (Redis via ElastiCache)
- [ ] Configurar rate limiting
- [ ] Usar SECRET_KEY forte e aleatória

### 10. Testes
- [ ] Executar `python manage.py check` localmente
- [ ] Testar em staging environment primeiro
- [ ] Verificar health checks do Beanstalk

---

## Variáveis de Ambiente Necessárias

```
DJANGO_SECRET_KEY=seu-secret-key-aleatorio-aqui
DJANGO_DEBUG=False
ALLOWED_HOSTS=seu-dominio.elasticbeanstalk.com,seu-dominio.com
DATABASE_URL=postgres://user:password@rds-endpoint:5432/dbname
AWS_ACCESS_KEY_ID=sua-key
AWS_SECRET_ACCESS_KEY=sua-secret
AWS_STORAGE_BUCKET_NAME=seu-bucket-s3
DJANGO_SETTINGS_MODULE=projeto.settings
CORS_ALLOWED_ORIGINS=https://seu-dominio.com
```
