# Guia de Início Rápido - IGNIS

## Para Desenvolvedores

### 1. Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/22augusta/ignisappmobile.git
cd ignisappmobile

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### 2. Executando o App

Após executar `npm start`, você verá um QR code. Você pode:

**Android:**
- Instale o app "Expo Go" da Play Store
- Escaneie o QR code com o app Expo Go

**iOS:**
- Instale o app "Expo Go" da App Store
- Escaneie o QR code com a câmera do iPhone

**Web:**
- Pressione `w` no terminal para abrir no navegador

### 3. Estrutura de Pastas

```
ignisappmobile/
├── src/
│   ├── screens/          # Telas do app
│   ├── contexts/         # Gerenciamento de estado
│   ├── services/         # API e Database
│   └── Navigation.js     # Navegação
├── assets/               # Imagens e ícones
├── App.js                # Ponto de entrada
└── package.json          # Dependências
```

### 4. Funcionalidades Principais

#### Registrar Nova Ocorrência
1. Na tela inicial, toque no botão "+"
2. Selecione o tipo de ocorrência
3. Preencha a descrição
4. Adicione fotos/vídeos (opcional)
5. Capture assinatura (opcional)
6. Toque em "Registrar Ocorrência"

#### Sincronizar Dados
1. Na tela inicial, toque em "🔄 Sincronizar"
2. Aguarde a sincronização com o servidor
3. Veja o status de cada ocorrência

#### Exportar Dados
1. Navegue para a aba "Exportar"
2. Escolha o formato (JSON ou CSV)
3. Compartilhe ou salve o arquivo

### 5. Modo Offline

O app funciona completamente offline:
- Todas as ocorrências são salvas localmente
- Sincronização automática quando online
- Dados persistentes entre sessões

### 6. Configuração da API

Para conectar ao servidor do CBMPE:

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite `.env` e configure a URL da API:
```
EXPO_PUBLIC_API_URL=https://api.cbmpe.gov.br
```

### 7. Build para Produção

#### Android (APK)
```bash
eas build --platform android --profile production
```

#### iOS (IPA)
```bash
eas build --platform ios --profile production
```

#### Web (PWA)
```bash
npm run web
npx expo export:web
```

## Para Usuários Finais

### Instalação

1. **Android**: Baixe o APK ou instale pela Play Store
2. **iOS**: Instale pela App Store
3. **Web**: Acesse https://ignis.cbmpe.gov.br

### Primeiro Acesso

1. Abra o aplicativo IGNIS
2. Faça login com suas credenciais do CBMPE
3. Permita acesso à câmera e localização

### Registrando uma Ocorrência

1. **Toque no botão "+"** na tela inicial
2. **Selecione o tipo**: Incêndio, Acidente, Resgate, etc.
3. **Descreva a ocorrência**: Seja claro e detalhado
4. **Localização**: Será capturada automaticamente
5. **Fotos**: Toque em "Tirar Foto" ou "Galeria"
6. **Vídeos**: Toque em "Gravar Vídeo" (máx. 60 segundos)
7. **Assinatura**: Toque em "Adicionar Assinatura"
8. **Salvar**: Toque em "Registrar Ocorrência"

### Visualizando Ocorrências

- **Lista**: Tela inicial mostra todas as ocorrências
- **Detalhes**: Toque em uma ocorrência para ver detalhes
- **Status**: Verde (concluído), Laranja (pendente), Azul (em andamento)

### Sincronização

- **Automática**: Quando o app detecta conexão
- **Manual**: Toque em "🔄 Sincronizar"
- **Status**: "⚠️ Não sincronizado" indica dados pendentes

### Exportando Dados

1. Vá para a aba "Exportar"
2. Veja as estatísticas
3. Escolha o formato de exportação
4. Compartilhe via WhatsApp, Email, etc.

### Dicas de Uso

✅ **Sempre permita acesso à localização** para registros precisos
✅ **Tire várias fotos** de diferentes ângulos
✅ **Seja detalhado na descrição** - ajuda na análise posterior
✅ **Sincronize regularmente** quando tiver conexão
✅ **Verifique o status** das ocorrências periodicamente

### Problemas Comuns

**App não abre a câmera?**
- Verifique as permissões do app nas configurações do celular

**Localização não funciona?**
- Ative o GPS do dispositivo
- Verifique as permissões de localização

**Sincronização falha?**
- Verifique sua conexão com a internet
- Tente novamente mais tarde
- Entre em contato com o suporte TI

### Suporte

Para suporte técnico:
- 📧 Email: ti@cbmpe.gov.br
- 📞 Telefone: (81) XXXX-XXXX
- 🌐 Portal: https://cbmpe.gov.br/suporte

---

**IGNIS - Sistema de Gestão de Ocorrências CBMPE**
*Versão 1.0.0*
