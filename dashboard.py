import streamlit as st
import requests
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# --- Configurações da Página ---
st.set_page_config(layout="wide", page_title="Dashboard Censo - Ilha Primeira")

API_BASE_URL = "https://mysite-sdz6.onrender.com/api/"

# --- Funções Auxiliares ---
@st.cache_data(ttl=600)
def fetch_data(endpoint_url):
    """Busca dados de um endpoint da API."""
    try:
        response = requests.get(endpoint_url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Erro ao conectar à API ({endpoint_url}): {e}")
        return None


def plot_countplot(df, column, title, ylabel, xlabel="Contagem", hue=None):
    if column not in df.columns or df[column].isnull().all():
        st.warning(f"Coluna '{column}' não encontrada ou vazia.")
        return

    plt.figure(figsize=(10, 6))
    sns.countplot(data=df, y=column, order=df[column].value_counts().index, hue=hue, palette="viridis")
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.tight_layout()
    st.pyplot(plt.gcf())
    plt.clf()


def plot_histplot(df, column, title, xlabel, ylabel="Frequência", bins=10):
    if column not in df.columns or df[column].isnull().all():
        st.warning(f"Coluna '{column}' não encontrada ou vazia.")
        return

    plt.figure(figsize=(10, 6))
    sns.histplot(df[column].dropna(), bins=bins, kde=True)
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.tight_layout()
    st.pyplot(plt.gcf())
    plt.clf()

def plot_piechart(df, column, title):
    if column not in df.columns or df[column].isnull().all():
        st.warning(f"Coluna '{column}' não encontrada ou vazia.")
        return

    counts = df[column].value_counts().dropna()

    fig, ax = plt.subplots(figsize=(10, 6))
    wedges, texts, autotexts = ax.pie(
        counts,
        labels=counts.index,
        autopct='%1.1f%%',
        startangle=90,
        colors=sns.color_palette('viridis'),
        wedgeprops={'edgecolor': 'white'}
    )
    ax.axis('equal')
    plt.title(title, fontsize=14)
    st.pyplot(fig)
    plt.clf()


# --- Título ---
st.title("📊 Dashboard Censo Demográfico - Ilha Primeira")

st.markdown("Análise dos dados coletados sobre domicílios e moradores.")

# --- Tabs ---
tab_domicilio, tab_morador, tab_indicadores = st.tabs(["🏠 Domicílios", "👥 Moradores", "📌 Indicadores"])

# ===========================
# 🏠 Aba Domicílios
# ===========================
with tab_domicilio:
    st.header("Análise dos Domicílios")

    domicilios_data = fetch_data(f"{API_BASE_URL}domicilios/")
    if domicilios_data:
        df_domicilios = pd.DataFrame(domicilios_data)
        st.markdown(f"**Total de domicílios registrados:** {len(df_domicilios)}")

        col1, col2 = st.columns(2)

        with col1:
            plot_countplot(df_domicilios, 'especie', 'Distribuição por Espécie de Domicílio', 'Espécie')
            plot_countplot(df_domicilios, 'tipo', 'Distribuição por Tipo de Domicílio', 'Tipo')
            plot_countplot(df_domicilios, 'abastecimento_agua', 'Abastecimento de Água', 'Tipo')
            plot_countplot(df_domicilios, 'coleta_esgoto', 'Coleta de Esgoto', 'Tipo')

        with col2:
            plot_countplot(df_domicilios, 'lixo_destino', 'Destino do Lixo', 'Destino')
            plot_countplot(df_domicilios, 'distribuicao_agua', 'Distribuição de Água na Casa', 'Distribuição')
            plot_countplot(df_domicilios, 'condicao_imovel', 'Condição do Imóvel', 'Condição')

            df_domicilios['acesso_internet'] = df_domicilios['acesso_internet'].replace([True, False], ["Sim", "Não"])
            plot_piechart(df_domicilios, 'acesso_internet', 'Possui Acesso à Internet?')

        st.subheader("🔍 Dados Brutos de Domicílios")
        st.dataframe(df_domicilios)

    else:
        st.warning("Não foi possível carregar os dados de domicílios.")

# ===========================
# 👥 Aba Moradores
# ===========================
with tab_morador:
    st.header("Análise dos Moradores")

    moradores_data = fetch_data(f"{API_BASE_URL}moradores/")
    if moradores_data:
        df_moradores = pd.DataFrame(moradores_data)
        st.markdown(f"**Total de moradores registrados:** {len(df_moradores)}")

        # Cálculo de idade
        if 'data_nascimento' in df_moradores.columns:
            df_moradores['data_nascimento'] = pd.to_datetime(df_moradores['data_nascimento'], errors='coerce')
            df_moradores['idade'] = df_moradores['data_nascimento'].apply(
                lambda x: datetime.now().year - x.year if pd.notnull(x) else None
            )

        col1, col2 = st.columns(2)

        with col1:
            plot_piechart(df_moradores, 'sexo', 'Distribuição por Sexo')
            plot_countplot(df_moradores, 'etnia', 'Distribuição por Raça/Cor', 'Etnia')
            plot_countplot(df_moradores, 'escolaridade', 'Distribuição por Escolaridade', 'Escolaridade')
            plot_countplot(df_moradores, 'religiao', 'Distribuição por Religião', 'Religião')

        with col2:
            plot_histplot(df_moradores, 'idade', 'Distribuição de Idade', 'Idade', bins=15)
            plot_piechart(df_moradores, 'renda', 'Distribuição por Faixa de Renda')
            plot_countplot(df_moradores, 'vinculo_domiciliar', 'Distribuição por Vínculo Domiciliar', 'Vínculo')
            plot_countplot(df_moradores, 'estado_civil', 'Distribuição por Estado Civil', 'Estado Civil')

        st.subheader("🔍 Dados Brutos de Moradores")
        st.dataframe(df_moradores)

    else:
        st.warning("Não foi possível carregar os dados de moradores.")

# ===========================
# 📌 Aba Indicadores
# ===========================
with tab_indicadores:
    st.header("Indicadores Qualitativos ou Gerais")

    indicadores_data = fetch_data(f"{API_BASE_URL}indicadores/")
    if indicadores_data:
        df_indicadores = pd.DataFrame(indicadores_data)
        st.markdown(f"**Total de indicadores registrados:** {len(df_indicadores)}")

        st.subheader("🔍 Dados Brutos de Indicadores")
        st.dataframe(df_indicadores)
    else:
        st.warning("Não foi possível carregar os dados de indicadores.")
