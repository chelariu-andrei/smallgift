# Valentine's Day Surprise App 🌸

## Status: Ready ✅
The application has been successfully built and verified.

## How to Run
1.  Open your terminal in this directory.
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Open the local URL (e.g., `http://localhost:5173`) in your browser.
    -   **Mobile Mode**: To test the touch interactions properly, use your browser's "Device Toolbar" (F12 -> Ctrl+Shift+M) or open the Network URL on your phone.

## Troubleshooting IDE Errors
If you see red squiggles in VS Code:
-   **TypeScript Errors** (`Cannot find module...`): These are "ghost" errors. The compiler (`tsc`) passes 100%. try **reloading your VS Code window** (Ctrl+Shift+P -> "Reload Window").
-   **CSS Warning** (`Unknown at rule @theme`): We are using Tailwind CSS v4. This is a valid directive, but some editor extensions haven't caught up yet. You can safely ignore it.

## Features
-   **Multi-language**: Toggle between Romanian (RO) and English (EN).
-   **Trap Page**: Try clicking "No"! 😈
-   **Dashboard**: After saying "Yes", access 3 distinct sections via bottom navigation:
    -   **Memories**: A scrollable feed of your journey.
    -   **Letter**: A special message waiting for you.
    -   **For You**: A surprise bouquet of flowers.

Happy Valentine's Day! ❤️
