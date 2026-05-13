from django.db import models

class Morador(models.Model):

    VINCULO_DOMICILIAR_CHOICES = [
    ('responsavel_domicilio', 'Pessoa responsável pelo domicílio'),
    ('conjuge_diferente_sexo', 'Cônjuge ou companheiro(a) de sexo diferente'),
    ('conjuge_mesmo_sexo', 'Cônjuge ou companheiro(a) do mesmo sexo'),
    ('filho_responsavel_e_conjuge', 'Filho(a) do responsável e do cônjuge'),
    ('filho_somente_responsavel', 'Filho(a) somente do responsável'),
    ('genro_nora', 'Genro ou nora'),
    ('pai_mae_padrasto_madrasta', 'Pai, mãe, padrasto ou madrasta'),
    ('sogro_sogra', 'Sogro(a)'),
    ('neto_neta', 'Neto(a)'),
    ('enteado_enteada', 'Enteado(a)'),
    ('irmao_irma', 'Irmão ou irmã'),
    ('avo_avos', 'Avô ou avó'),
    ('outro_parente', 'Outro parente'),
    ('agregado', 'Agregado(a)'),
    ('bisneto_bisneta', 'Bisneto(a)'),
    ('pensionista', 'Pensionista'),
    ('empregado_domestico', 'Empregado(a) doméstico(a)'),
    ('parente_empregado_domestico', 'Parente do(a) empregado(a) doméstico(a)'),
    ('individual_domicilio_coletivo', 'Individual em domicílio coletivo'),
]


    SEXO_CHOICES = [
        ('masculino', 'Masculino'),
        ('feminino', 'Feminino'),
    ]

    RENDA_CHOICES = [
        ('Menos de 1 salário mínimo', 'Menos de 1 salário mínimo'),
        ('De 1 a 2 salários mínimos', 'De 1 a 2 salários mínimos'),
        ('De 2 a 3 salários mínimos', 'De 2 a 3 salários mínimos'),
        ('De 3 a 4 salários mínimos', 'De 3 a 4 salários mínimos'),
        ('De 4 a 5 salários mínimos', 'De 4 a 5 salários mínimos'),
        ('Mais de 5 salários mínimos', 'Mais de 5 salários mínimos'),
    ]

    ESTADO_CIVIL_CHOICES = [
        ('Solteiro', 'Solteiro'),
        ('Casado', 'Casado'),
        ('Divorciado', 'Divorciado'),
        ('Viúvo', 'Viúvo'),
    ]

    ETNIA_CHOICES = [
        ('Branca', 'Branca'),
        ('Pardo', 'Pardo'),
        ('Preta', 'Preta'),
        ('Amarela', 'Amarela'),
        ('Indígena', 'Indígena'),
    ]

    ESCOLARIDADE_CHOICES = [
        ('Analfabeto', 'Analfabeto'),
        ('Fundamental incompleto', 'Fundamental incompleto'),
        ('Fundamental completo', 'Fundamental completo'),
        ('Médio incompleto', 'Médio incompleto'),
        ('Médio completo', 'Médio completo'),
        ('Superior incompleto', 'Superior incompleto'),
        ('Superior completo', 'Superior completo'),
    ]

    RELIGIAO_CHOICES = [
        ('Católica', 'Católica'),
        ('Evangélica', 'Evangélica'),
        ('Espírita', 'Espírita'),
        ('Umbanda', 'Umbanda'),
        ('Candomblé', 'Candomblé'),
        ('Sem religião', 'Sem religião'),
    ]

    REGISTRO_NASCIMENTO_CHOICES = [
        ('cartorio', 'Registro em cartório'),
        ('registro_indigena', 'Registro administrativo de nascimento indígena'),
        ('nao_tem', 'Não tem'),
        ('nao_sabe', 'Não sabe'),
    ]

    TIPO_UNIAO_CHOICES = [
        ('casamento_civil_religioso', 'Casamento civil e religioso'),
        ('casamento_civil', 'Só casamento civil'),
        ('casamento_religioso', 'Só casamento religioso'),
        ('uniao_consensual', 'União consensual'),
    ]

    GRAU_DEFICIENCIA_CHOICES = [
        ('nao_consegue', 'Tem, não consegue de modo algum'),
        ('muita_dificuldade', 'Tem muita dificuldade'),
        ('alguma_dificuldade', 'Tem alguma dificuldade'),
        ('sem_dificuldade', 'Não tem dificuldade'),
    ]

    FREQUENCIA_ESCOLAR_CHOICES = [
        ('sim', 'Sim'),
        ('nao_mas_ja_frequentou', 'Não, mas já frequentou'),
        ('nunca_frequentou', 'Não, nunca frequentou'),
    ]


    TIPO_CURSO_CHOICES = [
        ('pre_escola', 'Pré-escola'),
        ('creche', 'Creche'),
        ('alfabetizacao_jovens_adultos', 'Alfabetização de jovens e adultos'),
        ('ensino_fundamental', 'Regular do ensino fundamental'),
        ('eja_fundamental', 'EJA do ensino fundamental'),
        ('ensino_medio', 'Regular do ensino médio'),
        ('superior_graduacao', 'Superior de graduação'),
        ('eja_medio', 'EJA do ensino médio'),
        ('especializacao', 'Especialização de nível superior'),
        ('mestrado', 'Mestrado'),
        ('doutorado', 'Doutorado'),
        ('nenhum', 'Nenhum'),
    ]

    FAIXA_RENDIMENTO_CHOICES = [
        ('faixa_1', 'R$1,00 a R$500,00'),
        ('faixa_2', 'R$501,00 a R$1.000,00'),
        ('faixa_3', 'R$1.001,00 a R$2.000,00'),
        ('faixa_4', 'R$2.001,00 a R$3.000,00'),
        ('faixa_5', 'R$3.001,00 a R$5.000,00'),
        ('faixa_6', 'R$5.001,00 a R$10.000,00'),
        ('faixa_7', 'R$10.001,00 a R$20.000,00'),
        ('faixa_8', 'R$20.001,00 a R$100.000,00'),
        ('faixa_9', 'R$100.001,00 ou mais'),
    ]

    MEIO_TRANSPORTE_CHOICES = [
        ('a_pe', 'A pé'),
        ('bicicleta', 'Bicicleta'),
        ('motocicleta', 'Motocicleta'),
        ('mototaxi', 'Mototáxi'),
        ('automovel', 'Automóvel'),
        ('taxi', 'Táxi ou similares'),
        ('van_perua', 'Van, perua ou similares'),
        ('onibus', 'Ônibus'),
        ('caminhao_adaptado', 'Caminhonete ou caminhão adaptado'),
        ('embarcacao_grande', 'Embarcação de médio/grande porte'),
        ('embarcacao_pequena', 'Embarcação de pequeno porte'),
        ('outros', 'Outros'),
    ]



    cpf = models.CharField(max_length=11, unique=True, primary_key=True)
    nome = models.CharField(max_length=30)
    sobrenome = models.CharField(max_length=100)
    cep = models.CharField(max_length=8)
    num_casa = models.TextField()
    sexo = models.TextField(choices=SEXO_CHOICES)
    renda = models.TextField(choices=RENDA_CHOICES, null=True, blank=True)
    data_nascimento = models.DateField()
    estado_civil = models.TextField(choices=ESTADO_CIVIL_CHOICES, null=True, blank=True)
    etnia = models.TextField(choices=ETNIA_CHOICES, null=True, blank=True)
    escolaridade = models.TextField(choices=ESCOLARIDADE_CHOICES, null=True, blank=True)
    email = models.EmailField(max_length=100, null=True, blank=True)
    telefone = models.CharField(max_length=15, null=True, blank=True)
    nacionalidade = models.CharField(max_length=30)
    deficiencia = models.BooleanField(default=False)
    num_dependentes = models.IntegerField(default=0, null=True, blank=True)
    religiao = models.CharField(max_length=50, choices=RELIGIAO_CHOICES, null=True, blank=True)
    vinculo_domiciliar = models.TextField(choices=VINCULO_DOMICILIAR_CHOICES)

    registro_nascimento = models.CharField(
        max_length=50,
        choices=REGISTRO_NASCIMENTO_CHOICES,
        null=True,
        blank=True
    )
    possui_conjuge = models.BooleanField(default=False)
    vive_com_conjuge = models.BooleanField(default=False)
    nome_conjuge = models.CharField(max_length=130, null=True, blank=True)
    tipo_uniao = models.CharField(
        max_length=50,
        choices=TIPO_UNIAO_CHOICES,
        null=True,
        blank=True
    )
    trabalhou_atividade_remunerada = models.BooleanField(default=False)
    quantidade_trabalhos = models.IntegerField(null=True, blank=True)
    ocupacao = models.CharField(max_length=100, null=True, blank=True)
    atividade_empresa = models.CharField(max_length=100, null=True, blank=True)
    carteira_assinada = models.BooleanField(null=True, blank=True)
    empresa_registrada_cnpj = models.BooleanField(null=True, blank=True)
    faixa_rendimento = models.CharField(
        max_length=50,
        choices=FAIXA_RENDIMENTO_CHOICES,
        null=True,
        blank=True
    )
    diagnostico_autismo = models.BooleanField(default=False)
    diagnostico_deficiencia_visao = models.CharField(
        max_length=30,
        choices=GRAU_DEFICIENCIA_CHOICES,
        null=True,
        blank=True
    )
    diagnostico_deficiencia_andar = models.CharField(
        max_length=30,
        choices=GRAU_DEFICIENCIA_CHOICES,
        null=True,
        blank=True
    )
    frequenta_escola = models.CharField(
        max_length=30,
        choices=FREQUENCIA_ESCOLAR_CHOICES,
        null=True,
        blank=True
    )
    curso_frequentado = models.CharField(
        max_length=50,
        choices=TIPO_CURSO_CHOICES,
        null=True,
        blank=True
    )
    ja_concluiu_outro_superior = models.BooleanField(default=False)

    meio_transporte_trabalho = models.CharField(
        max_length=30,
        choices=MEIO_TRANSPORTE_CHOICES,
        null=True,
        blank=True
    )



    def __str__(self):
        return f"{self.nome} {self.sobrenome}: {self.cpf}"

class Indicadores(models.Model):
    pergunta = models.CharField(max_length=100)
    resposta = models.TextField()
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.pergunta


class Domicilio(models.Model):

    Especie_CHOICES =[
        ('Domicilio particular permanentemente', 'DOMICÍLIO PARTICULAR PERMANENTE OCUPADO'),
        ('Domicilio particular improvisado ocupado', 'DOMICÍLIO PARTICULAR IMPROVISADO OCUPADO'),
        ('Domicilio coletivo com morador', 'DOMICÍLIO COLETIVO COM MORADOR'),
    ]

    Tipo_CHOICES= [
        ('Casa', 'Casa'),
        ('Casa de vila ou em condomínio', 'Casa de vila ou em condomínio'),
        ('Apartamento', 'Apartamento'),
        ('Habitação em casa de cômodos ou cortiço', 'Habitação em casa de cômodos ou cortiço'),
        ('Habitação indígena sem paredes ou maloca', 'Habitação indígena sem paredes ou maloca'),
        ('Estrutura residencial permanente degradada ou inacabada', 'Estrutura residencial permanente degradada ou inacabada'),
        ('Tenda ou barraca de lona, plástico ou tecido', 'Tenda ou barraca de lona, plástico ou tecido'),
        ('Dentro do estabelecimento em funcionamento', 'Dentro do estabelecimento em funcionamento'),
        ('Outros (abrigos naturais e outras estruturas improvisadas)', 'Outros (abrigos naturais e outras estruturas improvisadas)'),
        ('Estrutura improvisada em logradouro público, exceto tenda ou barraca', 'Estrutura improvisada em logradouro público, exceto tenda ou barraca'),
        ('Estrutura não residencial permanente degradada ou inacabada', 'Estrutura não residencial permanente degradada ou inacabada'),
        ('Veículos (carros, caminhões, trailers, barcos etc.)', 'Veículos (carros, caminhões, trailers, barcos etc.)'),
        ('Asilo ou outra instituição de longa permanência para idosos', 'Asilo ou outra instituição de longa permanência para idosos'),
        ('Hotel ou pensão', 'Hotel ou pensão'),
        ('Alojamento', 'Alojamento'),
        ('Penitenciária, centro de detenção e similar', 'Penitenciária, centro de detenção e similar'),
        ('Outro', 'Outro'),
        ('Abrigo, albergue ou casa de passagem para população em situação de rua', 'Abrigo, albergue ou casa de passagem para população em situação de rua'),
        ('Abrigo, casas de passagem ou república assistencial para outros grupos vulneráveis', 'Abrigo, casas de passagem ou república assistencial para outros grupos vulneráveis'),
        ('Clínica psiquiátrica, comunidade terapêutica e similar', 'Clínica psiquiátrica, comunidade terapêutica e similar'),
        ('Orfanato e similar', 'Orfanato e similar'),
        ('Unidade de internação de menores', 'Unidade de internação de menores'),
        ('Quartel ou outra organização militar', 'Quartel ou outra organização militar'),
    ]

    CONDICAO_IMOVEL_CHOICES = [
        ('ainda_pagando', 'Ainda pagando'),
        ('alugado', 'Alugado'),
        ('por_empregador', 'Por empregador'),
        ('por_familiar', 'Por familiar'),
        ('outra_forma', 'Outra forma'),
        ('outra_condicao', 'Outra condição'),
        ('ja_pago_herdado_ou_ganho', 'Já pago, herdado ou ganho'),
    ]

    ABASTECIMENTO_CHOICES = [
        ('Rede geral de distribuição', 'Rede geral de distribuição'),
        ('Poço artesiano', 'Poço artesiano'),
        ('Cacimba', 'Cacimba'),
        ('Rio, lago, córregos ou represas', 'Rio, lago, córregos ou represas'),
        ('fonte, nascente ou mina', 'fonte, nascente ou mina'),
        ('carro-pipa', 'carro-pipa'),
        ('água de chuva', 'água de chuva'),
        ('Outro', 'Outro'),
        ]

    ESGOTO_CHOICES = [
        ('Rede geral de esgoto', 'Rede geral de esgoto'),
        ('Fossa séptica', 'Fossa séptica'),
        ('Fossa rudimentar', 'Fossa rudimentar'),
        ('Rio, lago, córregos ou represas', 'Rio, lago, córregos ou represas'),
        ('Vala', 'Vala'),
        ('Outro', 'Outro'),
        ]

    DISTRIBUICAO_AGUA_CHOICES = [
        ('Encanada até dentro da moradia', 'Encanada até dentro da moradia'),
        ('Encanada, mas apenas terreno ou quintal', 'Encanada, mas apenas terreno ou quintal'),
        ('Não encanada', 'Não encanada'),
        ]

    LIXO_CHOICES = [
        ('Coletado pela prefeitura', 'Coletado pela prefeitura'),
        ('Coletado por empresa particular', 'Coletado por empresa particular'),
        ('Queimado', 'Queimado'),
        ('Enterrado', 'Enterrado'),
        ('Jogado em terreno baldio', 'Jogado em terreno baldio'),
        ('Jogado em rio, lago, córrego ou represa', 'Jogado em rio, lago, córrego ou represa'),
        ('Outro', 'Outro'),
        ]

    RUA_CHOICES = [
        ("R. Marina do Sol"),
        ("R. Marina do Frade"),
        ("R. Marina dos Coqueiros"),
        ("R. Marina da Lua"),
        ("R. Marina do Bosque"),
        ("R. Marina Porto Bali"),
        ("R. Marina das Flores"),
        ("R. Marina das Estrelas"),
        ("R. Marina Ponta Leste"),
    ]

    proprietario = models.ForeignKey(Morador, related_name='domicilios', on_delete=models.CASCADE, null=True, blank=True)

    uf = models.CharField(max_length=2)
    municipio = models.TextField()
    rua = models.TextField(choices=[(r, r) for r in RUA_CHOICES])
    setor = models.TextField()
    numero = models.TextField()

    especie = models.TextField(choices=Especie_CHOICES, null=True, blank=True)
    tipo = models.TextField(choices=Tipo_CHOICES)
    condicao_imovel = models.TextField(choices=CONDICAO_IMOVEL_CHOICES)

    quantidade_comodos = models.IntegerField()
    quantidade_dormitorios = models.IntegerField(null=True, blank=True)
    banheiros_com_chuveiro = models.IntegerField(null=True, blank=True)
    banheiros_sem_chuveiro = models.IntegerField(null=True, blank=True)

    acesso_internet = models.BooleanField(default=False)
    energia_eletrica = models.BooleanField(default=False)
    abastecimento_agua = models.TextField(choices=ABASTECIMENTO_CHOICES)
    coleta_esgoto = models.TextField(choices=ESGOTO_CHOICES)
    distribuicao_agua = models.TextField(choices=DISTRIBUICAO_AGUA_CHOICES)

    lixo_destino = models.TextField(choices=LIXO_CHOICES)
    lixo_quantidade = models.IntegerField(null=True, blank=True)

    tem_maquina_lavar = models.BooleanField(default=False)
    principais_demandas = models.TextField(null=True, blank=True)
    relacao_outras_ilhas = models.TextField(null=True, blank=True)

    quem_respondeu_nome = models.CharField(max_length=100)
    quem_respondeu_email = models.EmailField()
    quem_respondeu_telefone = models.CharField(max_length=15)

    chega_conexao_internet = models.BooleanField(default=False)


    def __str__(self):
        return str(self.proprietario)