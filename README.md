# Open-Higgsfield AI 🎥✨

![Open-Higgsfield Banner](public/banner.png)

A local, open-source clone of **Higgsfield AI**, powered by [Muapi](https://muapi.ai) for high-end video and image generation. This project aims to replicate the premium experience of Higgsfield's studios locally, giving you control over your creative workflow with your own API keys.

## 🚀 Features

### 1. AI Image Studio 🎨
*   **High-Fidelity Generation**: Create stunning visuals using top-tier models like **Flux.1 Dev** and **SDXL**.
*   **Advanced Controls**: Fine-tune your output with negative prompts, aspect ratio selection (1:1, 16:9, 9:16), and seed control.
*   **Gallery**: Persistent history of your generations.

### 2. AI Video Studio 🎬
*   **Text-to-Video (T2V)**: Turn your scripts into cinematic videos using models like **Wan 2.5** and **Google Veo**.
*   **Image-to-Video (I2V)**: Bring static images to life with motion.
*   **Motion Buckets**: Control the intensity of movement (Static, Gentle, Dynamic).

### 3. Cinema Studio 🎥
*   **Pro Camera Controls**: Simulate real manufacturing lenses (e.g., *Studio Digital S35*).
*   **Physical Movements**: Control Zoom, Pan, Tilt, and Roll just like a real camera.
*   **Directors Mode**: Precise keyframing for camera trajectories (Coming Soon).

### 4. Soul ID & Lipsync 🗣️
*   **Character Consistency**: Maintain character identity across multiple generations.
*   **Lipsync Studio**: Upload an audio file or type text to make your characters speak with perfect lip synchronization.

## 🛠️ Tech Stack

*   **Frontend**: [Vite](https://vitejs.dev/) + Vanilla JavaScript for lightning-fast performance.
*   **Styling**: Vanilla CSS (Custom Glassmorphism & Neon Design System).
*   **API Integration**: [Muapi.ai](https://muapi.ai) (Vadoo Engine).
*   **No Backend**: Runs entirely in the browser (Client-side API calls).

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/open-higgsfield-ai.git
    cd open-higgsfield-ai
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` in your browser.

## 🔑 Configuration

To use the generation features, you need a Muapi API Key.

1.  Go to [Muapi.ai Dashboard](https://muapi.ai/dashboard) and generate a key.
2.  Open the app settings (Gear icon).
3.  Paste your API Key. It defaults to browser `localStorage` for security.

## 🛣️ Roadmap

- [ ] **Phase 1**: AI Image Studio (Flux Integration)
- [ ] **Phase 2**: AI Video Studio (Wan/Veo Integration)
- [ ] **Phase 3**: Cinema Studio (Camera Motion Controls)
- [ ] **Phase 4**: Soul ID & Lipsync Implementation

---

*Disclaimer: This is a community project and is not affiliated with Higgsfield AI. Usage costs are dependent on your Muapi API usage.*
