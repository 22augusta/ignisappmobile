# Contributing to IGNIS

Obrigado por contribuir com o projeto IGNIS! Este documento fornece diretrizes para contribuições.

## Como Contribuir

### Reportando Bugs

Se você encontrar um bug, por favor abra uma issue incluindo:

- Descrição detalhada do problema
- Passos para reproduzir o bug
- Comportamento esperado vs. comportamento atual
- Screenshots (se aplicável)
- Versão do aplicativo e dispositivo

### Sugerindo Melhorias

Sugestões de novas funcionalidades são bem-vindas! Por favor inclua:

- Descrição clara da funcionalidade
- Justificativa (por que seria útil?)
- Exemplos de uso
- Mockups ou wireframes (se aplicável)

### Pull Requests

1. Faça um fork do repositório
2. Crie uma branch para sua feature/correção (`git checkout -b feature/MinhaFuncionalidade`)
3. Faça commit das suas mudanças (`git commit -am 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/MinhaFuncionalidade`)
5. Abra um Pull Request

#### Convenção de Commits

Seguimos a convenção de commits semânticos:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula faltando, etc
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Tarefas de manutenção

Exemplo:
```
feat: adiciona filtro por data na lista de ocorrências
fix: corrige bug na captura de localização
docs: atualiza instruções de instalação no README
```

### Padrões de Código

- Use JavaScript ES6+
- Siga o estilo de código existente no projeto
- Adicione comentários onde necessário
- Mantenha as funções pequenas e focadas
- Escreva código autoexplicativo

### Estrutura de Componentes

Ao criar novos componentes:

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MeuComponente({ prop1, prop2 }) {
  // Lógica do componente
  
  return (
    <View style={styles.container}>
      <Text>Conteúdo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // estilos
  },
});
```

### Testando Suas Mudanças

Antes de submeter um PR:

1. Teste no Android (se possível)
2. Teste no iOS (se possível)
3. Teste no navegador (PWA)
4. Verifique o modo offline
5. Verifique a sincronização de dados

### Documentação

- Atualize o README.md se necessário
- Adicione comentários JSDoc para funções complexas
- Atualize a API_DOCUMENTATION.md se houver mudanças na integração

### Code Review

- Esteja aberto a feedback
- Responda às revisões de forma construtiva
- Faça as alterações solicitadas ou explique por que não são necessárias

## Desenvolvimento Local

### Configuração do Ambiente

```bash
# Clone o repositório
git clone https://github.com/22augusta/ignisappmobile.git

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis
├── contexts/         # React Contexts
├── screens/          # Telas do app
├── services/         # Serviços (API, Database)
├── utils/            # Funções utilitárias
└── types/            # Tipos e constantes
```

### Dicas Úteis

- Use `console.log` com moderação em produção
- Trate erros adequadamente
- Valide entradas do usuário
- Teste em diferentes tamanhos de tela
- Considere performance em dispositivos antigos

## Questões?

Se você tiver dúvidas sobre como contribuir, sinta-se à vontade para:

- Abrir uma issue para discussão
- Entrar em contato com a equipe de desenvolvimento
- Consultar a documentação existente

## Código de Conduta

- Seja respeitoso com outros contribuidores
- Aceite críticas construtivas
- Foque no que é melhor para o projeto
- Mantenha um ambiente colaborativo e inclusivo

Obrigado por contribuir com o IGNIS! 🔥
