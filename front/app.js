/**
 * ==================== CENSO AMIP - FRONTEND APPLICATION ====================
 * 
 * Arquivo principal da aplicação frontend - consumo da API Django REST
 * Organizado em módulos para facilitar manutenção e expansão
 * 
 * Módulos:
 * 1. CONFIG - Configurações globais
 * 2. API CLIENT - Integração com endpoints
 * 3. STATE MANAGER - Gerenciamento de estado local
 * 4. UI MANAGER - Manipulação de DOM e interface
 * 5. WIZARD MANAGER - Lógica do wizard de cadastro
 * 6. FORM MANAGER - Gerenciamento de formulários
 * 7. TABLE MANAGER - Renderização e manipulação de tabelas
 * 8. EXPORT MANAGER - Exportação de dados (CSV, relatórios)
 * 9. EVENT LISTENERS - Delegação de eventos
 * 10. INITIALIZATION - Inicialização da aplicação
 */

// ==================== 1. CONFIG ====================

const CONFIG = {
    API_BASE_URL: 'http://localhost:8000/api/',
    API_TIMEOUT: 5000,
    ITEMS_PER_PAGE: 20,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
    DEBUG: true
};

// ==================== 2. API CLIENT ====================

class ApiClient {
    /**
     * GET /api/moradores/
     * @returns {Promise<Array>} Lista de moradores
     */
    static async getMoreadores() {
        return await this._fetch(`${CONFIG.API_BASE_URL}moradores/`);
    }

    /**
     * POST /api/moradores/
     * @param {Object} data - Dados do morador
     * @returns {Promise<Object>} Morador criado
     */
    static async createMoreador(data) {
        return await this._fetch(`${CONFIG.API_BASE_URL}moradores/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT /api/moradores/{cpf}/
     * @param {String} cpf - CPF do morador
     * @param {Object} data - Dados atualizados
     * @returns {Promise<Object>} Morador atualizado
     */
    static async updateMoreador(cpf, data) {
        return await this._fetch(`${CONFIG.API_BASE_URL}moradores/${cpf}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE /api/moradores/{cpf}/
     * @param {String} cpf - CPF do morador
     * @returns {Promise<void>}
     */
    static async deleteMoreador(cpf) {
        return await this._fetch(`${CONFIG.API_BASE_URL}moradores/${cpf}/`, {
            method: 'DELETE'
        });
    }

    /**
     * GET /api/domicilios/
     * @returns {Promise<Array>} Lista de domicílios
     */
    static async getDomicilios() {
        return await this._fetch(`${CONFIG.API_BASE_URL}domicilios/`);
    }

    /**
     * POST /api/domicilios/
     * @param {Object} data - Dados do domicílio
     * @returns {Promise<Object>} Domicílio criado
     */
    static async createDomicilio(data) {
        return await this._fetch(`${CONFIG.API_BASE_URL}domicilios/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT /api/domicilios/{id}/
     * @param {Number} id - ID do domicílio
     * @param {Object} data - Dados atualizados
     * @returns {Promise<Object>} Domicílio atualizado
     */
    static async updateDomicilio(id, data) {
        return await this._fetch(`${CONFIG.API_BASE_URL}domicilios/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE /api/domicilios/{id}/
     * @param {Number} id - ID do domicílio
     * @returns {Promise<void>}
     */
    static async deleteDomicilio(id) {
        return await this._fetch(`${CONFIG.API_BASE_URL}domicilios/${id}/`, {
            method: 'DELETE'
        });
    }

    /**
     * GET /api/indicadores/
     * @returns {Promise<Array>} Lista de indicadores
     */
    static async getIndicadores() {
        return await this._fetch(`${CONFIG.API_BASE_URL}indicadores/`);
    }

    /**
     * POST /api/indicadores/
     * @param {Object} data - Dados do indicador
     * @returns {Promise<Object>} Indicador criado
     */
    static async createIndicador(data) {
        return await this._fetch(`${CONFIG.API_BASE_URL}indicadores/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT /api/indicadores/{id}/
     * @param {Number} id - ID do indicador
     * @param {Object} data - Dados atualizados
     * @returns {Promise<Object>} Indicador atualizado
     */
    static async updateIndicador(id, data) {
        return await this._fetch(`${CONFIG.API_BASE_URL}indicadores/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE /api/indicadores/{id}/
     * @param {Number} id - ID do indicador
     * @returns {Promise<void>}
     */
    static async deleteIndicador(id) {
        return await this._fetch(`${CONFIG.API_BASE_URL}indicadores/${id}/`, {
            method: 'DELETE'
        });
    }

    /**
     * Wrapper para todas as requisições fetch
     * @private
     */
    static async _fetch(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const fetchOptions = { ...defaultOptions, ...options };

        try {
            UiManager.showLoading('Carregando...');
            
            const response = await Promise.race([
                fetch(url, fetchOptions),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), CONFIG.API_TIMEOUT)
                )
            ]);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Erro ${response.status}: ${response.statusText}`);
            }

            // DELETE sem retorno
            if (response.status === 204) {
                return null;
            }

            const data = await response.json();
            UiManager.hideLoading();
            return data;

        } catch (error) {
            UiManager.hideLoading();
            UiManager.showToast(error.message || 'Erro na requisição', 'error');
            if (CONFIG.DEBUG) console.error('API Error:', error);
            throw error;
        }
    }
}

// ==================== 3. STATE MANAGER ====================

class StateManager {
    static state = {
        moradores: [],
        domicilios: [],
        indicadores: [],
        wizardData: {},
        currentSection: 'dashboard',
        currentPage: 1
    };

    static cache = {
        moradores: { data: null, timestamp: 0 },
        domicilios: { data: null, timestamp: 0 },
        indicadores: { data: null, timestamp: 0 }
    };

    /**
     * Salva dados em localStorage
     */
    static saveToLocalStorage(key, data) {
        localStorage.setItem(`censo_${key}`, JSON.stringify(data));
    }

    /**
     * Recupera dados do localStorage
     */
    static getFromLocalStorage(key) {
        const data = localStorage.getItem(`censo_${key}`);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Verifica se cache ainda é válido
     */
    static isCacheValid(type) {
        const cache = this.cache[type];
        return cache.data && (Date.now() - cache.timestamp) < CONFIG.CACHE_DURATION;
    }

    /**
     * Atualiza cache
     */
    static updateCache(type, data) {
        this.cache[type] = {
            data,
            timestamp: Date.now()
        };
    }

    /**
     * Carrega dados com cache
     */
    static async loadData(type) {
        if (this.isCacheValid(type)) {
            return this.cache[type].data;
        }

        let data;
        if (type === 'moradores') {
            data = await ApiClient.getMoreadores();
        } else if (type === 'domicilios') {
            data = await ApiClient.getDomicilios();
        } else if (type === 'indicadores') {
            data = await ApiClient.getIndicadores();
        }

        this.state[type] = data;
        this.updateCache(type, data);
        return data;
    }

    /**
     * Salva estado do wizard
     */
    static setWizardData(step, data) {
        this.state.wizardData[step] = data;
        this.saveToLocalStorage('wizardData', this.state.wizardData);
    }

    /**
     * Recupera estado do wizard
     */
    static getWizardData(step) {
        const saved = this.getFromLocalStorage('wizardData');
        return saved ? saved[step] : null;
    }

    /**
     * Limpa dados do wizard
     */
    static clearWizardData() {
        this.state.wizardData = {};
        localStorage.removeItem('censo_wizardData');
    }
}

// ==================== 4. UI MANAGER ====================

class UiManager {
    /**
     * Mostra modal
     */
    static showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Esconde modal
     */
    static hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Mostra spinner de carregamento
     */
    static showLoading(text = 'Carregando...') {
        const spinner = document.getElementById('loading-spinner');
        const loadingText = document.getElementById('loading-text');
        if (spinner) {
            loadingText.textContent = text;
            spinner.classList.remove('hidden');
        }
    }

    /**
     * Esconde spinner
     */
    static hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }

    /**
     * Exibe notificação (toast)
     */
    static showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    /**
     * Atualiza estatísticas no dashboard
     */
    static async updateDashboardStats() {
        try {
            const moradores = await StateManager.loadData('moradores');
            const domicilios = await StateManager.loadData('domicilios');
            const indicadores = await StateManager.loadData('indicadores');

            document.getElementById('stat-moradores').textContent = moradores.length;
            document.getElementById('stat-domicilios').textContent = domicilios.length;
            document.getElementById('stat-indicadores').textContent = indicadores.length;
        } catch (error) {
            if (CONFIG.DEBUG) console.error('Erro ao atualizar estatísticas:', error);
        }
    }

    /**
     * Muda seção ativa no sidebar
     */
    static setActiveSection(sectionName) {
        // Remove classe active de todos os links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Adiciona classe active no link clicado
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

        // Atualiza título da página
        const titles = {
            'moradores': '👥 Moradores',
            'domicilios': '🏠 Domicílios',
            'indicadores': '📋 Indicadores',
            'relatorios': '📈 Relatórios'
        };
        document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';

        StateManager.state.currentSection = sectionName;
    }
}

// ==================== 5. WIZARD MANAGER ====================

class WizardManager {
    static currentStep = 1;
    static totalSteps = 4;

    /**
     * Renderiza o wizard
     */
    static renderWizard() {
        const container = document.getElementById('wizard-container');
        container.innerHTML = `
            <div class="wizard-container">
                <div class="wizard-steps">
                    <div class="wizard-step ${this.currentStep >= 1 ? 'active' : ''}">
                        <div class="wizard-step-number">1</div>
                        <div class="wizard-step-label">Morador</div>
                    </div>
                    <div class="wizard-step ${this.currentStep >= 2 ? 'active' : ''}">
                        <div class="wizard-step-number">2</div>
                        <div class="wizard-step-label">Domicílio</div>
                    </div>
                    <div class="wizard-step ${this.currentStep >= 3 ? 'active' : ''}">
                        <div class="wizard-step-number">3</div>
                        <div class="wizard-step-label">Indicadores</div>
                    </div>
                    <div class="wizard-step ${this.currentStep >= 4 ? 'active' : ''}">
                        <div class="wizard-step-number">4</div>
                        <div class="wizard-step-label">Revisão</div>
                    </div>
                </div>

                <form id="wizard-form" class="wizard-form">
                    ${this._getStepContent()}
                </form>

                <div class="wizard-actions">
                    ${this.currentStep > 1 ? '<button type="button" class="btn btn-secondary" id="btn-prev">← Anterior</button>' : ''}
                    <div style="flex: 1;"></div>
                    ${this.currentStep < this.totalSteps ? '<button type="button" class="btn btn-primary" id="btn-next">Próximo →</button>' : ''}
                    ${this.currentStep === this.totalSteps ? '<button type="submit" class="btn btn-success" id="btn-submit">Confirmar e Salvar</button>' : ''}
                </div>
            </div>
        `;

        this._attachWizardEvents();
    }

    /**
     * Retorna conteúdo do passo atual
     * @private
     */
    static _getStepContent() {
        const templates = {
            1: this._getStep1Template(),
            2: this._getStep2Template(),
            3: this._getStep3Template(),
            4: this._getStep4Template()
        };
        return templates[this.currentStep] || '';
    }

    /**
     * Template Passo 1: Dados do Morador
     * @private
     */
    static _getStep1Template() {
        const data = StateManager.getWizardData('morador') || {};
        return `
            <h3>Dados Pessoais do Morador</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="cpf" class="required">CPF</label>
                    <input type="text" id="cpf" name="cpf" placeholder="11111111111" maxlength="11" value="${data.cpf || ''}" required>
                </div>
                <div class="form-group">
                    <label for="nome" class="required">Nome</label>
                    <input type="text" id="nome" name="nome" placeholder="João" value="${data.nome || ''}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="sobrenome" class="required">Sobrenome</label>
                    <input type="text" id="sobrenome" name="sobrenome" placeholder="Silva" value="${data.sobrenome || ''}" required>
                </div>
                <div class="form-group">
                    <label for="data_nascimento" class="required">Data de Nascimento</label>
                    <input type="date" id="data_nascimento" name="data_nascimento" value="${data.data_nascimento || ''}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="sexo" class="required">Sexo</label>
                    <select id="sexo" name="sexo" required>
                        <option value="">Selecione...</option>
                        <option value="masculino" ${data.sexo === 'masculino' ? 'selected' : ''}>Masculino</option>
                        <option value="feminino" ${data.sexo === 'feminino' ? 'selected' : ''}>Feminino</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="nacionalidade" class="required">Nacionalidade</label>
                    <input type="text" id="nacionalidade" name="nacionalidade" placeholder="Brasileira" value="${data.nacionalidade || ''}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="cep" class="required">CEP</label>
                    <input type="text" id="cep" name="cep" placeholder="20000000" maxlength="8" value="${data.cep || ''}" required>
                </div>
                <div class="form-group">
                    <label for="num_casa" class="required">Nº da Casa</label>
                    <input type="text" id="num_casa" name="num_casa" placeholder="123" value="${data.num_casa || ''}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="vinculo_domiciliar" class="required">Vínculo Domiciliar</label>
                    <select id="vinculo_domiciliar" name="vinculo_domiciliar" required>
                        <option value="">Selecione...</option>
                        <option value="responsavel_domicilio" ${data.vinculo_domiciliar === 'responsavel_domicilio' ? 'selected' : ''}>Responsável pelo domicílio</option>
                        <option value="conjuge_diferente_sexo" ${data.vinculo_domiciliar === 'conjuge_diferente_sexo' ? 'selected' : ''}>Cônjuge de sexo diferente</option>
                        <option value="filho_responsavel_e_conjuge" ${data.vinculo_domiciliar === 'filho_responsavel_e_conjuge' ? 'selected' : ''}>Filho(a)</option>
                        <option value="outro_parente" ${data.vinculo_domiciliar === 'outro_parente' ? 'selected' : ''}>Outro parente</option>
                        <option value="agregado" ${data.vinculo_domiciliar === 'agregado' ? 'selected' : ''}>Agregado(a)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="renda">Renda</label>
                    <select id="renda" name="renda">
                        <option value="">Selecione...</option>
                        <option value="Menos de 1 salário mínimo" ${data.renda === 'Menos de 1 salário mínimo' ? 'selected' : ''}>Menos de 1 SM</option>
                        <option value="De 1 a 2 salários mínimos" ${data.renda === 'De 1 a 2 salários mínimos' ? 'selected' : ''}>1 a 2 SM</option>
                        <option value="De 2 a 3 salários mínimos" ${data.renda === 'De 2 a 3 salários mínimos' ? 'selected' : ''}>2 a 3 SM</option>
                        <option value="De 3 a 4 salários mínimos" ${data.renda === 'De 3 a 4 salários mínimos' ? 'selected' : ''}>3 a 4 SM</option>
                        <option value="De 4 a 5 salários mínimos" ${data.renda === 'De 4 a 5 salários mínimos' ? 'selected' : ''}>4 a 5 SM</option>
                        <option value="Mais de 5 salários mínimos" ${data.renda === 'Mais de 5 salários mínimos' ? 'selected' : ''}>Mais de 5 SM</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="escolaridade">Escolaridade</label>
                    <select id="escolaridade" name="escolaridade">
                        <option value="">Selecione...</option>
                        <option value="Analfabeto" ${data.escolaridade === 'Analfabeto' ? 'selected' : ''}>Analfabeto</option>
                        <option value="Fundamental incompleto" ${data.escolaridade === 'Fundamental incompleto' ? 'selected' : ''}>Fundamental Incompleto</option>
                        <option value="Fundamental completo" ${data.escolaridade === 'Fundamental completo' ? 'selected' : ''}>Fundamental Completo</option>
                        <option value="Médio incompleto" ${data.escolaridade === 'Médio incompleto' ? 'selected' : ''}>Médio Incompleto</option>
                        <option value="Médio completo" ${data.escolaridade === 'Médio completo' ? 'selected' : ''}>Médio Completo</option>
                        <option value="Superior incompleto" ${data.escolaridade === 'Superior incompleto' ? 'selected' : ''}>Superior Incompleto</option>
                        <option value="Superior completo" ${data.escolaridade === 'Superior completo' ? 'selected' : ''}>Superior Completo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="etnia">Etnia</label>
                    <select id="etnia" name="etnia">
                        <option value="">Selecione...</option>
                        <option value="Branca" ${data.etnia === 'Branca' ? 'selected' : ''}>Branca</option>
                        <option value="Pardo" ${data.etnia === 'Pardo' ? 'selected' : ''}>Pardo</option>
                        <option value="Preta" ${data.etnia === 'Preta' ? 'selected' : ''}>Preta</option>
                        <option value="Amarela" ${data.etnia === 'Amarela' ? 'selected' : ''}>Amarela</option>
                        <option value="Indígena" ${data.etnia === 'Indígena' ? 'selected' : ''}>Indígena</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="joao@example.com" value="${data.email || ''}">
                </div>
                <div class="form-group">
                    <label for="telefone">Telefone</label>
                    <input type="tel" id="telefone" name="telefone" placeholder="21987654321" value="${data.telefone || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="deficiencia">Possui deficiência?</label>
                    <select id="deficiencia" name="deficiencia">
                        <option value="false" ${data.deficiencia === false || data.deficiencia === 'false' ? 'selected' : ''}>Não</option>
                        <option value="true" ${data.deficiencia === true || data.deficiencia === 'true' ? 'selected' : ''}>Sim</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="num_dependentes">Nº de Dependentes</label>
                    <input type="number" id="num_dependentes" name="num_dependentes" min="0" value="${data.num_dependentes || 0}">
                </div>
            </div>
        `;
    }

    /**
     * Template Passo 2: Dados do Domicílio
     * @private
     */
    static _getStep2Template() {
        const data = StateManager.getWizardData('domicilio') || {};
        return `
            <h3>Dados do Domicílio</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="uf" class="required">UF</label>
                    <input type="text" id="uf" name="uf" placeholder="RJ" maxlength="2" value="${data.uf || ''}" required>
                </div>
                <div class="form-group">
                    <label for="municipio" class="required">Município</label>
                    <input type="text" id="municipio" name="municipio" placeholder="Rio de Janeiro" value="${data.municipio || ''}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="rua" class="required">Rua</label>
                    <select id="rua" name="rua" required>
                        <option value="">Selecione...</option>
                        <option value="R. Marina do Sol" ${data.rua === 'R. Marina do Sol' ? 'selected' : ''}>R. Marina do Sol</option>
                        <option value="R. Marina do Frade" ${data.rua === 'R. Marina do Frade' ? 'selected' : ''}>R. Marina do Frade</option>
                        <option value="R. Marina dos Coqueiros" ${data.rua === 'R. Marina dos Coqueiros' ? 'selected' : ''}>R. Marina dos Coqueiros</option>
                        <option value="R. Marina da Lua" ${data.rua === 'R. Marina da Lua' ? 'selected' : ''}>R. Marina da Lua</option>
                        <option value="R. Marina do Bosque" ${data.rua === 'R. Marina do Bosque' ? 'selected' : ''}>R. Marina do Bosque</option>
                        <option value="R. Marina Porto Bali" ${data.rua === 'R. Marina Porto Bali' ? 'selected' : ''}>R. Marina Porto Bali</option>
                        <option value="R. Marina das Flores" ${data.rua === 'R. Marina das Flores' ? 'selected' : ''}>R. Marina das Flores</option>
                        <option value="R. Marina das Estrelas" ${data.rua === 'R. Marina das Estrelas' ? 'selected' : ''}>R. Marina das Estrelas</option>
                        <option value="R. Marina Ponta Leste" ${data.rua === 'R. Marina Ponta Leste' ? 'selected' : ''}>R. Marina Ponta Leste</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="numero" class="required">Número</label>
                    <input type="text" id="numero" name="numero" placeholder="123" value="${data.numero || ''}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="setor" class="required">Setor</label>
                    <input type="text" id="setor" name="setor" placeholder="Setor A" value="${data.setor || ''}" required>
                </div>
                <div class="form-group">
                    <label for="tipo" class="required">Tipo de Imóvel</label>
                    <select id="tipo" name="tipo" required>
                        <option value="">Selecione...</option>
                        <option value="Casa" ${data.tipo === 'Casa' ? 'selected' : ''}>Casa</option>
                        <option value="Apartamento" ${data.tipo === 'Apartamento' ? 'selected' : ''}>Apartamento</option>
                        <option value="Outro" ${data.tipo === 'Outro' ? 'selected' : ''}>Outro</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="condicao_imovel" class="required">Condição do Imóvel</label>
                    <select id="condicao_imovel" name="condicao_imovel" required>
                        <option value="">Selecione...</option>
                        <option value="ainda_pagando" ${data.condicao_imovel === 'ainda_pagando' ? 'selected' : ''}>Ainda pagando</option>
                        <option value="alugado" ${data.condicao_imovel === 'alugado' ? 'selected' : ''}>Alugado</option>
                        <option value="ja_pago_herdado_ou_ganho" ${data.condicao_imovel === 'ja_pago_herdado_ou_ganho' ? 'selected' : ''}>Já pago/herdado/ganho</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="quantidade_comodos" class="required">Quantidade de Cômodos</label>
                    <input type="number" id="quantidade_comodos" name="quantidade_comodos" min="1" value="${data.quantidade_comodos || 1}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="abastecimento_agua" class="required">Abastecimento de Água</label>
                    <select id="abastecimento_agua" name="abastecimento_agua" required>
                        <option value="">Selecione...</option>
                        <option value="Rede geral de distribuição" ${data.abastecimento_agua === 'Rede geral de distribuição' ? 'selected' : ''}>Rede geral de distribuição</option>
                        <option value="Poço artesiano" ${data.abastecimento_agua === 'Poço artesiano' ? 'selected' : ''}>Poço artesiano</option>
                        <option value="Outro" ${data.abastecimento_agua === 'Outro' ? 'selected' : ''}>Outro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="coleta_esgoto" class="required">Coleta de Esgoto</label>
                    <select id="coleta_esgoto" name="coleta_esgoto" required>
                        <option value="">Selecione...</option>
                        <option value="Rede geral de esgoto" ${data.coleta_esgoto === 'Rede geral de esgoto' ? 'selected' : ''}>Rede geral de esgoto</option>
                        <option value="Fossa séptica" ${data.coleta_esgoto === 'Fossa séptica' ? 'selected' : ''}>Fossa séptica</option>
                        <option value="Outro" ${data.coleta_esgoto === 'Outro' ? 'selected' : ''}>Outro</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="distribuicao_agua" class="required">Distribuição da Água</label>
                    <select id="distribuicao_agua" name="distribuicao_agua" required>
                        <option value="">Selecione...</option>
                        <option value="Encanada até dentro da moradia" ${data.distribuicao_agua === 'Encanada até dentro da moradia' ? 'selected' : ''}>Dentro da moradia</option>
                        <option value="Encanada, mas apenas terreno ou quintal" ${data.distribuicao_agua === 'Encanada, mas apenas terreno ou quintal' ? 'selected' : ''}>Terreno/quintal</option>
                        <option value="Não encanada" ${data.distribuicao_agua === 'Não encanada' ? 'selected' : ''}>Não encanada</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="lixo_destino" class="required">Destino do Lixo</label>
                    <select id="lixo_destino" name="lixo_destino" required>
                        <option value="">Selecione...</option>
                        <option value="Coletado pela prefeitura" ${data.lixo_destino === 'Coletado pela prefeitura' ? 'selected' : ''}>Coletado pela prefeitura</option>
                        <option value="Queimado" ${data.lixo_destino === 'Queimado' ? 'selected' : ''}>Queimado</option>
                        <option value="Outro" ${data.lixo_destino === 'Outro' ? 'selected' : ''}>Outro</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="energia_eletrica">Energia Elétrica</label>
                    <select id="energia_eletrica" name="energia_eletrica">
                        <option value="true" ${data.energia_eletrica === 'true' || data.energia_eletrica === true ? 'selected' : ''}>Sim</option>
                        <option value="false" ${data.energia_eletrica === 'false' || data.energia_eletrica === false ? 'selected' : ''}>Não</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="acesso_internet">Acesso à Internet</label>
                    <select id="acesso_internet" name="acesso_internet">
                        <option value="true" ${data.acesso_internet === 'true' || data.acesso_internet === true ? 'selected' : ''}>Sim</option>
                        <option value="false" ${data.acesso_internet === 'false' || data.acesso_internet === false ? 'selected' : ''}>Não</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="quem_respondeu_nome" class="required">Nome de Quem Respondeu</label>
                    <input type="text" id="quem_respondeu_nome" name="quem_respondeu_nome" value="${data.quem_respondeu_nome || ''}" required>
                </div>
                <div class="form-group">
                    <label for="quem_respondeu_email" class="required">Email de Quem Respondeu</label>
                    <input type="email" id="quem_respondeu_email" name="quem_respondeu_email" value="${data.quem_respondeu_email || ''}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="quem_respondeu_telefone" class="required">Telefone de Quem Respondeu</label>
                    <input type="tel" id="quem_respondeu_telefone" name="quem_respondeu_telefone" value="${data.quem_respondeu_telefone || ''}" required>
                </div>
                <div class="form-group">
                    <label for="chega_conexao_internet">Chega conexão de internet?</label>
                    <select id="chega_conexao_internet" name="chega_conexao_internet">
                        <option value="true" ${data.chega_conexao_internet === 'true' || data.chega_conexao_internet === true ? 'selected' : ''}>Sim</option>
                        <option value="false" ${data.chega_conexao_internet === 'false' || data.chega_conexao_internet === false ? 'selected' : ''}>Não</option>
                    </select>
                </div>
            </div>
        `;
    }

    /**
     * Template Passo 3: Indicadores
     * @private
     */
    static _getStep3Template() {
        const data = StateManager.getWizardData('indicador') || {};
        return `
            <h3>Indicadores Adicionais</h3>
            <p style="color: var(--color-text-light); margin-bottom: 20px;">Preencha informações adicionais (opcional)</p>
            <div class="form-group">
                <label for="pergunta">Pergunta</label>
                <input type="text" id="pergunta" name="pergunta" placeholder="Qual é a pergunta?" value="${data.pergunta || ''}">
            </div>
            <div class="form-group">
                <label for="resposta">Resposta</label>
                <textarea id="resposta" name="resposta" placeholder="Digite a resposta...">${data.resposta || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="descricao">Descrição Adicional</label>
                <textarea id="descricao" name="descricao" placeholder="Digite uma descrição adicional...">${data.descricao || ''}</textarea>
            </div>
        `;
    }

    /**
     * Template Passo 4: Revisão
     * @private
     */
    static _getStep4Template() {
        const morador = StateManager.getWizardData('morador') || {};
        const domicilio = StateManager.getWizardData('domicilio') || {};
        const indicador = StateManager.getWizardData('indicador') || {};

        return `
            <h3>Revisão dos Dados</h3>
            <div style="background-color: var(--color-bg-light); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: var(--color-primary); margin-bottom: 15px;">Morador</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div><strong>CPF:</strong> ${morador.cpf || '-'}</div>
                    <div><strong>Nome:</strong> ${morador.nome || '-'} ${morador.sobrenome || '-'}</div>
                    <div><strong>Data de Nascimento:</strong> ${morador.data_nascimento || '-'}</div>
                    <div><strong>Renda:</strong> ${morador.renda || '-'}</div>
                </div>
            </div>
            <div style="background-color: var(--color-bg-light); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: var(--color-primary); margin-bottom: 15px;">Domicílio</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div><strong>Rua:</strong> ${domicilio.rua || '-'}</div>
                    <div><strong>Número:</strong> ${domicilio.numero || '-'}</div>
                    <div><strong>Município:</strong> ${domicilio.municipio || '-'}</div>
                    <div><strong>Tipo:</strong> ${domicilio.tipo || '-'}</div>
                </div>
            </div>
            ${indicador.pergunta ? `
            <div style="background-color: var(--color-bg-light); padding: 20px; border-radius: 8px;">
                <h4 style="color: var(--color-primary); margin-bottom: 15px;">Indicadores</h4>
                <div><strong>Pergunta:</strong> ${indicador.pergunta || '-'}</div>
                <div style="margin-top: 10px;"><strong>Resposta:</strong> ${indicador.resposta || '-'}</div>
            </div>
            ` : ''}
        `;
    }

    /**
     * Anexa eventos do wizard
     * @private
     */
    static _attachWizardEvents() {
        const btnNext = document.getElementById('btn-next');
        const btnPrev = document.getElementById('btn-prev');
        const btnSubmit = document.getElementById('btn-submit');
        const wizardForm = document.getElementById('wizard-form');

        if (btnNext) {
            btnNext.addEventListener('click', () => this.nextStep());
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', () => this.prevStep());
        }

        if (wizardForm) {
            wizardForm.addEventListener('submit', (e) => this.submitForm(e));
        }

        if (btnSubmit) {
            btnSubmit.addEventListener('click', () => {
                wizardForm?.requestSubmit();
            });
        }
    }

    /**
     * Vai para o próximo passo
     */
    static nextStep() {
        if (this.validateStep()) {
            this.saveStepData();
            this.currentStep++;
            this.renderWizard();
        }
    }

    /**
     * Volta para o passo anterior
     */
    static prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderWizard();
        }
    }

    /**
     * Valida passo atual
     */
    static validateStep() {
        const form = document.getElementById('wizard-form');
        if (!form) return true;

        const requiredFields = form.querySelectorAll('[required]');
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                UiManager.showToast(`Campo "${field.previousElementSibling.textContent}" é obrigatório`, 'warning');
                return false;
            }
        }
        if (this.currentStep === 1) {
            const cpfField = form.querySelector('[name="cpf"]');
            const cepField = form.querySelector('[name="cep"]');
            const cpf = cpfField ? cpfField.value.replace(/\D/g, '') : '';
            const cep = cepField ? cepField.value.replace(/\D/g, '') : '';

            if (!/^\d{11}$/.test(cpf)) {
                UiManager.showToast('CPF deve conter exatamente 11 dígitos numéricos', 'warning');
                return false;
            }

            if (!/^\d{8}$/.test(cep)) {
                UiManager.showToast('CEP deve conter exatamente 8 dígitos numéricos', 'warning');
                return false;
            }
        }

        return true;
    }

    /**
     * Salva dados do passo atual
     */
    static saveStepData() {
        const form = document.getElementById('wizard-form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        ['deficiencia', 'energia_eletrica', 'acesso_internet', 'chega_conexao_internet', 'tem_maquina_lavar'].forEach((fieldName) => {
            if (fieldName in data) {
                data[fieldName] = data[fieldName] === 'true';
            }
        });

        if ('cpf' in data) {
            data.cpf = data.cpf.replace(/\D/g, '');
        }

        if ('cep' in data) {
            data.cep = data.cep.replace(/\D/g, '');
        }

        if ('num_dependentes' in data) {
            data.num_dependentes = Number(data.num_dependentes || 0);
        }

        if ('quantidade_comodos' in data) {
            data.quantidade_comodos = Number(data.quantidade_comodos || 0);
        }

        if (this.currentStep === 1) {
            StateManager.setWizardData('morador', data);
        } else if (this.currentStep === 2) {
            StateManager.setWizardData('domicilio', data);
        } else if (this.currentStep === 3) {
            StateManager.setWizardData('indicador', data);
        }
    }

    /**
     * Submete formulário
     */
    static async submitForm(e) {
        e.preventDefault();
        this.saveStepData();

        try {
            UiManager.showLoading('Salvando dados...');

            const morador = StateManager.getWizardData('morador');
            const domicilio = StateManager.getWizardData('domicilio');
            const indicador = StateManager.getWizardData('indicador');

            if (!morador || !domicilio) {
                throw new Error('Os dados obrigatórios do cadastro não foram preenchidos.');
            }

            // Criar morador
            const moradorCriado = await ApiClient.createMoreador(morador);

            // Criar domicílio (com proprietário = CPF do morador)
            if (domicilio) {
                domicilio.proprietario = moradorCriado.cpf;
                await ApiClient.createDomicilio(domicilio);
            }

            // Criar indicador (se preenchido)
            if (indicador.pergunta) {
                await ApiClient.createIndicador(indicador);
            }

            UiManager.hideLoading();
            UiManager.showToast('Registro salvo com sucesso!', 'success');

            // Limpar cache e dados do wizard
            StateManager.cache.moradores.data = null;
            StateManager.cache.domicilios.data = null;
            StateManager.cache.indicadores.data = null;
            StateManager.clearWizardData();

            // Voltar ao dashboard
            this.reset();
            await showDashboard();

        } catch (error) {
            UiManager.hideLoading();
            UiManager.showToast(error.message || 'Erro ao salvar registro', 'error', 5000);
            if (CONFIG.DEBUG) console.error('Erro ao salvar:', error);
        }
    }

    /**
     * Reseta o wizard
     */
    static reset() {
        this.currentStep = 1;
        StateManager.clearWizardData();
    }
}

// ==================== 6. FORM MANAGER ====================

class FormManager {
    /**
     * Popula formulário com dados
     */
    static populateForm(form, data) {
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }

    /**
     * Obtém dados do formulário
     */
    static getFormData(form) {
        const formData = new FormData(form);
        return Object.fromEntries(formData);
    }

    /**
     * Limpa formulário
     */
    static clearForm(form) {
        form.reset();
    }
}

// ==================== 7. TABLE MANAGER ====================

class TableManager {
    static currentPage = 1;
    static filteredData = [];
    static allData = [];

    /**
     * Renderiza tabela
     */
    static async renderTable(type) {
        try {
            this.allData = await StateManager.loadData(type);
            this.filteredData = [...this.allData];
            this._displayTable(type);
        } catch (error) {
            if (CONFIG.DEBUG) console.error('Erro ao renderizar tabela:', error);
        }
    }

    /**
     * Exibe tabela paginada
     * @private
     */
    static _displayTable(type) {
        const container = document.getElementById('table-container');
        const start = (this.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
        const end = start + CONFIG.ITEMS_PER_PAGE;
        const pageData = this.filteredData.slice(start, end);

        let html = `
            <div class="table-actions">
                <div class="table-search">
                    <input type="text" id="table-search" placeholder="Buscar..." data-type="${type}">
                </div>
                <button class="btn btn-primary" id="btn-refresh">🔄 Atualizar</button>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
        `;

        // Cabeçalhos
        if (type === 'moradores' && pageData.length > 0) {
            html += `
                <th>CPF</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Renda</th>
                <th>Ações</th>
            `;
        } else if (type === 'domicilios' && pageData.length > 0) {
            html += `
                <th>ID</th>
                <th>Rua</th>
                <th>Município</th>
                <th>Tipo</th>
                <th>Ações</th>
            `;
        } else if (type === 'indicadores' && pageData.length > 0) {
            html += `
                <th>ID</th>
                <th>Pergunta</th>
                <th>Resposta</th>
                <th>Ações</th>
            `;
        }

        html += `
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Linhas
        if (pageData.length === 0) {
            html += '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum registro encontrado</td></tr>';
        } else {
            pageData.forEach(item => {
                if (type === 'moradores') {
                    html += `
                        <tr>
                            <td>${item.cpf}</td>
                            <td>${item.nome} ${item.sobrenome}</td>
                            <td>${item.email || '-'}</td>
                            <td>${item.renda || '-'}</td>
                            <td class="table-actions-cell">
                                <button class="btn-table view" data-id="${item.cpf}" data-type="${type}">👁️ Ver</button>
                                <button class="btn-table edit" data-id="${item.cpf}" data-type="${type}">✏️ Editar</button>
                                <button class="btn-table delete" data-id="${item.cpf}" data-type="${type}">🗑️ Deletar</button>
                            </td>
                        </tr>
                    `;
                } else if (type === 'domicilios') {
                    html += `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.rua}</td>
                            <td>${item.municipio}</td>
                            <td>${item.tipo}</td>
                            <td class="table-actions-cell">
                                <button class="btn-table view" data-id="${item.id}" data-type="${type}">👁️ Ver</button>
                                <button class="btn-table edit" data-id="${item.id}" data-type="${type}">✏️ Editar</button>
                                <button class="btn-table delete" data-id="${item.id}" data-type="${type}">🗑️ Deletar</button>
                            </td>
                        </tr>
                    `;
                } else if (type === 'indicadores') {
                    html += `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.pergunta}</td>
                            <td>${(item.resposta || '-').substring(0, 50)}...</td>
                            <td class="table-actions-cell">
                                <button class="btn-table view" data-id="${item.id}" data-type="${type}">👁️ Ver</button>
                                <button class="btn-table edit" data-id="${item.id}" data-type="${type}">✏️ Editar</button>
                                <button class="btn-table delete" data-id="${item.id}" data-type="${type}">🗑️ Deletar</button>
                            </td>
                        </tr>
                    `;
                }
            });
        }

        html += `
                    </tbody>
                </table>
            </div>
        `;

        // Paginação
        const totalPages = Math.ceil(this.filteredData.length / CONFIG.ITEMS_PER_PAGE);
        if (totalPages > 1) {
            html += '<div class="pagination">';
            for (let i = 1; i <= totalPages; i++) {
                html += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            html += '</div>';
        }

        container.innerHTML = html;
        this._attachTableEvents(type);
    }

    /**
     * Anexa eventos da tabela
     * @private
     */
    static _attachTableEvents(type) {
        // Busca
        const searchInput = document.getElementById('table-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterData(e.target.value, type));
        }

        // Botão atualizar
        const btnRefresh = document.getElementById('btn-refresh');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', async () => {
                StateManager.cache[type].data = null;
                await this.renderTable(type);
            });
        }

        // Ações de tabela
        document.querySelectorAll('.btn-table').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.btn-table').className.split(' ').find(c => c !== 'btn-table');
                const id = e.target.closest('.btn-table').dataset.id;
                this._handleTableAction(action, id, type);
            });
        });

        // Paginação
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.dataset.page);
                this._displayTable(type);
            });
        });
    }

    /**
     * Filtra dados
     */
    filterData(query, type) {
        this.currentPage = 1;
        this.filteredData = this.allData.filter(item => {
            const searchStr = JSON.stringify(item).toLowerCase();
            return searchStr.includes(query.toLowerCase());
        });
        this._displayTable(type);
    }

    /**
     * Manipula ações de tabela
     * @private
     */
    static _handleTableAction(action, id, type) {
        if (action === 'view') {
            this._viewItem(id, type);
        } else if (action === 'edit') {
            this._editItem(id, type);
        } else if (action === 'delete') {
            this._deleteItem(id, type);
        }
    }

    /**
     * Ver item
     * @private
     */
    static _viewItem(id, type) {
        const item = this.allData.find(i => 
            (type === 'moradores' ? i.cpf === id : i.id == id)
        );
        if (!item) return;

        const modalBody = document.getElementById('modal-view-body');
        modalBody.innerHTML = `<pre>${JSON.stringify(item, null, 2)}</pre>`;
        UiManager.showModal('modal-view');
    }

    /**
     * Editar item
     * @private
     */
    static _editItem(id, type) {
        UiManager.showToast('Funcionalidade de edição em desenvolvimento', 'info');
    }

    /**
     * Deletar item
     * @private
     */
    static async _deleteItem(id, type) {
        const confirmDelete = async () => {
            try {
                UiManager.showLoading('Deletando...');
                
                if (type === 'moradores') {
                    await ApiClient.deleteMoreador(id);
                } else if (type === 'domicilios') {
                    await ApiClient.deleteDomicilio(id);
                } else if (type === 'indicadores') {
                    await ApiClient.deleteIndicador(id);
                }

                UiManager.hideLoading();
                UiManager.showToast('Registro deletado com sucesso!', 'success');

                // Limpar cache e recarregar
                StateManager.cache[type].data = null;
                await this.renderTable(type);
                UiManager.hideModal('modal-delete');

            } catch (error) {
                UiManager.hideLoading();
                if (CONFIG.DEBUG) console.error('Erro ao deletar:', error);
            }
        };

        document.getElementById('modal-delete-confirm').onclick = confirmDelete;
        UiManager.showModal('modal-delete');
    }
}

// ==================== 8. EXPORT MANAGER ====================

class ExportManager {
    /**
     * Exporta dados para CSV
     */
    static exportCSV(data, filename = 'censo_amip.csv') {
        if (!data || data.length === 0) {
            UiManager.showToast('Nenhum dado para exportar', 'warning');
            return;
        }

        const headers = Object.keys(data[0]);
        const rows = data.map(item =>
            headers.map(header => {
                const value = item[header];
                // Escapar aspas duplas e envolver em aspas
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
        );

        const csv = [
            headers.join(','),
            ...rows
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();

        UiManager.showToast('Arquivo exportado com sucesso!', 'success');
    }

    /**
     * Gera relatório visual
     */
    static async generateReport() {
        try {
            const moradores = await StateManager.loadData('moradores');
            const domicilios = await StateManager.loadData('domicilios');
            const indicadores = await StateManager.loadData('indicadores');

            const report = {
                total_moradores: moradores.length,
                total_domicilios: domicilios.length,
                total_indicadores: indicadores.length,
                // Estatísticas adicionais podem ser adicionadas aqui
            };

            return report;
        } catch (error) {
            if (CONFIG.DEBUG) console.error('Erro ao gerar relatório:', error);
            return null;
        }
    }
}

// ==================== 9. EVENT LISTENERS ====================

function setupEventListeners() {
    // Navegação do sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            handleNavigation(section);
        });
    });

    // Botão novo wizard
    const btnWizard = document.getElementById('btn-start-wizard');
    if (btnWizard) {
        btnWizard.addEventListener('click', (e) => {
            e.preventDefault();
            showWizard();
        });
    }

    // Fechar modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.dataset.modal;
            UiManager.hideModal(modalId);
        });
    });

    // Botões de cancelar em modals
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-secondary')) {
                const modalId = e.target.dataset.modal;
                UiManager.hideModal(modalId);
            }
        });
    });

    // Fechar modal ao clicar no overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// ==================== 10. NAVIGATION & DISPLAY ====================

async function handleNavigation(section) {
    // Esconder todos os containers
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('wizard-container').classList.add('hidden');
    document.getElementById('table-container').classList.add('hidden');
    document.getElementById('relatorios-container').classList.add('hidden');

    UiManager.setActiveSection(section);

    if (section === 'moradores') {
        await showMoreadores();
    } else if (section === 'domicilios') {
        await showDomicilios();
    } else if (section === 'indicadores') {
        await showIndicadores();
    } else if (section === 'relatorios') {
        await showRelatorios();
    }
}

async function showDashboard() {
    document.getElementById('dashboard-container').classList.remove('hidden');
    document.getElementById('wizard-container').classList.add('hidden');
    document.getElementById('table-container').classList.add('hidden');
    document.getElementById('relatorios-container').classList.add('hidden');

    UiManager.setActiveSection('dashboard');
    await UiManager.updateDashboardStats();
}

function showWizard() {
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('wizard-container').classList.remove('hidden');
    document.getElementById('table-container').classList.add('hidden');
    document.getElementById('relatorios-container').classList.add('hidden');

    WizardManager.reset();
    WizardManager.renderWizard();
}

async function showMoreadores() {
    document.getElementById('table-container').classList.remove('hidden');
    await TableManager.renderTable('moradores');
}

async function showDomicilios() {
    document.getElementById('table-container').classList.remove('hidden');
    await TableManager.renderTable('domicilios');
}

async function showIndicadores() {
    document.getElementById('table-container').classList.remove('hidden');
    await TableManager.renderTable('indicadores');
}

async function showRelatorios() {
    document.getElementById('relatorios-container').classList.remove('hidden');

    try {
        const report = await ExportManager.generateReport();
        const container = document.getElementById('relatorios-container');

        let html = `
            <h2>Relatório do Censo AMIP</h2>
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <h3>Total de Moradores</h3>
                    <p class="stat-number">${report.total_moradores}</p>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🏠</div>
                    <h3>Total de Domicílios</h3>
                    <p class="stat-number">${report.total_domicilios}</p>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📋</div>
                    <h3>Total de Indicadores</h3>
                    <p class="stat-number">${report.total_indicadores}</p>
                </div>
            </div>
            <div style="margin-top: 30px;">
                <button class="btn btn-primary" id="btn-export-csv">📥 Exportar Todos os Dados (CSV)</button>
            </div>
        `;

        container.innerHTML = html;

        // Evento de exportação
        document.getElementById('btn-export-csv').addEventListener('click', async () => {
            try {
                const moradores = await StateManager.loadData('moradores');
                ExportManager.exportCSV(moradores, 'moradores.csv');
            } catch (error) {
                if (CONFIG.DEBUG) console.error('Erro ao exportar:', error);
            }
        });

    } catch (error) {
        if (CONFIG.DEBUG) console.error('Erro ao exibir relatórios:', error);
    }
}

// ==================== 11. INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', async () => {
    if (CONFIG.DEBUG) console.log('🚀 Iniciando Censo AMIP...');

    // Setup de eventos globais
    setupEventListeners();

    // Teste de conexão com API
    try {
        await StateManager.loadData('moradores');
        UiManager.showToast('✅ Conectado à API', 'success', 2000);
    } catch (error) {
        UiManager.showToast('⚠️ Erro ao conectar com API', 'error', 3000);
    }

    // Inicializar dashboard
    await showDashboard();

    if (CONFIG.DEBUG) console.log('✨ Aplicação carregada com sucesso!');
});

// Função de debug (abrir no console)
window.DEBUG_STATE = () => {
    console.log('Current State:', StateManager.state);
    console.log('Cache:', StateManager.cache);
};
