# IGNIS - Sistema de Gestão de Ocorrências CBMPE

O projeto IGNIS é um aplicativo mobile desenvolvido para o Corpo de Bombeiros Militar de Pernambuco (CBMPE) destinado à coleta e gestão de dados de ocorrências em campo.

## Funcionalidades

### ✅ Recursos Implementados

- **Registro Padronizado de Ocorrências**: Sistema de formulário com campos padronizados para diferentes tipos de ocorrências
- **Operação Offline**: Banco de dados local SQLite para registro de ocorrências mesmo sem conexão à internet
- **Captura de Mídia**:
  - 📷 Fotos (câmera e galeria)
  - 🎥 Vídeos 
- **Localização GPS**: Captura automática de coordenadas geográficas e endereço
- **Assinatura Digital**: Interface para captura de assinaturas digitais
- **Sincronização Automática**: Sincronização com banco de dados central do CBMPE quando houver conexão
- **Acompanhamento em Tempo Real**: Visualização de status das ocorrências (Pendente, Em Andamento, Concluído)
- **Exportação de Dados**: 
  - Exportação em formato JSON
  - Exportação em formato CSV (compatível com Excel)
  - Compartilhamento de estatísticas
- **Autenticação**: Sistema de login para acesso seguro
- **Interface Intuitiva**: Design clean e fácil de usar, otimizado para uso em campo

## Tecnologias Utilizadas

- **React Native** com **Expo** - Framework para desenvolvimento cross-platform
- **React Navigation** - Navegação entre telas
- **Expo SQLite** - Banco de dados local para operação offline
- **Expo Location** - Serviços de geolocalização
- **Expo Camera** - Captura de fotos e vídeos
- **Expo Image Picker** - Seleção de mídia da galeria
- **React Native Signature Canvas** - Captura de assinaturas digitais
- **Axios** - Cliente HTTP para comunicação com API
- **AsyncStorage** - Armazenamento persistente de dados

## Estrutura do Projeto

```
ignisappmobile/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/         # Context API para gerenciamento de estado
│   │   ├── AuthContext.js
│   │   └── IncidentContext.js
│   ├── screens/          # Telas do aplicativo
│   │   ├── HomeScreen.js
│   │   ├── NewIncidentScreen.js
│   │   ├── IncidentDetailScreen.js
│   │   ├── SignatureScreen.js
│   │   ├── LoginScreen.js
│   │   └── ExportScreen.js
│   ├── services/         # Serviços e integrações
│   │   ├── database.js   # Operações do banco de dados local
│   │   └── api.js        # Integração com API CBMPE
│   ├── utils/            # Funções utilitárias
│   ├── types/            # Tipos e constantes
│   └── Navigation.js     # Configuração de navegação
├── assets/               # Imagens e recursos
├── App.js                # Ponto de entrada
├── app.json              # Configurações do Expo
└── package.json          # Dependências

```

## Instalação e Execução

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Expo CLI (instalado globalmente)

### Passo a Passo

1. Clone o repositório:
```bash
git clone https://github.com/22augusta/ignisappmobile.git
cd ignisappmobile
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o aplicativo:

Para desenvolvimento:
```bash
npm start
```

Para Android:
```bash
npm run android
```

Para iOS (apenas macOS):
```bash
npm run ios
```

Para Web:
```bash
npm run web
```

## Configuração da API

Para conectar o aplicativo ao servidor central do CBMPE, configure a variável de ambiente `EXPO_PUBLIC_API_URL`:

Crie um arquivo `.env` na raiz do projeto:
```
EXPO_PUBLIC_API_URL=https://api.cbmpe.gov.br
```

## Tipos de Ocorrências Suportadas

- 🔥 Incêndio
- 🚗 Acidente de Trânsito
- 🚑 Resgate
- 🏥 Emergência Médica
- ⚠️ Vazamento de Gás
- 🏚️ Desabamento
- ➕ Outros

## Fluxo de Trabalho

1. **Login**: Autenticação do usuário
2. **Registro**: Criação de nova ocorrência com dados padronizados
3. **Captura de Dados**: Adicionar fotos, vídeos, localização e assinatura
4. **Salvamento Local**: Dados salvos no banco SQLite local
5. **Sincronização**: Upload automático para servidor central quando online
6. **Exportação**: Geração de relatórios em JSON/CSV

## Segurança

- Autenticação via token JWT
- Dados criptografados em trânsito (HTTPS)
- Armazenamento seguro de credenciais
- Validação de permissões de acesso

## Permissões Necessárias

### Android
- Câmera
- Localização (GPS)
- Armazenamento (leitura/escrita)
- Microfone (para vídeos)

### iOS
- Câmera
- Localização quando em uso
- Galeria de fotos
- Microfone

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença especificada no arquivo LICENSE.

## Suporte

Para suporte e questões técnicas, entre em contato com a equipe de TI do CBMPE.

## Roadmap Futuro

- [ ] Notificações push para atualizações de ocorrências
- [ ] Modo de trabalho em equipe com múltiplos usuários
- [ ] Relatórios estatísticos avançados
- [ ] Integração com sistema de despacho
- [ ] Suporte a anexos adicionais (documentos PDF, áudios)
- [ ] Modo escuro
- [ ] Internacionalização (i18n)

## Desenvolvido para

**Corpo de Bombeiros Militar de Pernambuco (CBMPE)**

---

*Versão 1.0.0 - 2025*
