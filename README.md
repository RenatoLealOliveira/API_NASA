# 🚀 NASA Tools Explorer

Uma interface moderna e interativa para explorar o universo através das APIs públicas da NASA.
**Acesse agora:** [https://api-nasa-green.vercel.app/](https://api-nasa-green.vercel.app/)

![NASA Tools Preview](https://api-nasa-green.vercel.app/opengraph-image.png)

## ✨ Funcionalidades

### 1. 🌌 Foto Astronômica do Dia (APOD)
Explore a imagem selecionada diariamente pela NASA.
*   **Tradução Automática:** Explicações traduzidas para o português em tempo real.
*   **Navegação no Tempo:** Viaje para qualquer data desde 1995.
*   **Conteúdo Aleatório:** Surpreenda-se com imagens e vídeos randômicos.
*   **Suporte a Vídeo:** Reprodução integrada de vídeos do YouTube/Vimeo.

### 2. 🔴 Explorador de Marte
Veja o que os rovers veem.
*   **Rovers:** Curiosity, Opportunity e Spirit.
*   **Filtros:** Busque por data marciana (Sol) ou terrestre.
*   **Câmeras:** Filtre por câmeras específicas de cada rover.
*   **Interface:** Visualização em grade infinita com skeleton loading.

### 3. 🔭 Biblioteca de Mídia da NASA
O arquivo histórico completo.
*   **Busca Poderosa:** Pesquise por "Lua", "Apollo 11", "Nebulosa", etc.
*   **Multimídia:** Suporte a fotos e vídeos.
*   **Detalhes:** Informações técnicas, metadados e localização original dos arquivos.

### 4. 🎨 Design & UX
*   **Modo Noturno:** Um tema escuro imersivo com fundo estrelado dinâmico.
*   **Responsivo:** Perfeito no celular, tablet ou desktop.
*   **Performance:** Desenvolvido com Next.js para máxima velocidade.

---

## 🧠 Desafios & Soluções Técnicas

Durante o desenvolvimento, vários desafios interessantes foram superados para garantir uma experiência fluida:

### 1. Integração com APIs da NASA
A API de imagens da NASA é poderosa, mas complexa.
*   **Desafio:** Algumas fotos de Marte ou do APOD podem não existir em certas datas ou retornar erros 404/400.
*   **Solução:** Implementei um sistema de **"Smart Fallback"**. Se a foto do dia de hoje ainda não foi publicada (devido ao fuso horário da NASA), o sistema detecta o erro e busca automaticamente a foto de ontem, garantindo que o usuário nunca veja uma tela vazia.

### 2. Performance e Imagens Pesadas
Astronomical pictures podem ser gigantescas (MBs ou GBs).
*   **Desafio:** Carregar galerias de Marte sem travar o navegador.
*   **Solução:**
    *   Uso de **Skeleton Screens** (telas de esqueleto) para dar feedback visual imediato enquanto os dados carregam.
    *   **Lazy Loading** nativo do Next.js para imagens.
    *   Paginação inteligente e "Infinite Scroll" nas galerias maiores.

---

## 🛠️ Tecnologias Utilizadas

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
*   **APIs:**
    *   [NASA APOD API](https://api.nasa.gov/)
    *   [NASA Image and Video Library](https://images.nasa.gov/)
    *   [Google Translate API (Unofficial)](https://github.com/matheuss/google-translate-api)
*   **Deploy:** [Vercel](https://vercel.com/)

---

## 🏃 Como Rodar Localmente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/RenatoLealOliveira/API_NASA.git
    cd nasa-tools
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz e adicione sua chave:
    ```bash
    NEXT_PUBLIC_NASA_API_KEY=SUA_CHAVE_AQUI
    ```

4.  **Inicie o servidor:**
    ```bash
    npm run dev
    ```

Visite `http://localhost:3000` para ver o app voando! 🚀

---

## 👨‍💻 Autor

Projetado e desenvolvido por **Renato Leal de Oliveira**.
[LinkedIn](https://www.linkedin.com/in/renato-leal-de-oliveira/)
