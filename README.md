# LinkSync: AI-Powered Network Designer

<p align="center">
  <img src="https://placehold.co/600x300/000000/00FF00?text=LinkSync&font=monospace" alt="LinkSync Banner">
</p>

<p align="center">
  <strong>Your personal AI agent for creating robust, secure, and scalable Cisco network topologies in minutes.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/React-18.2.0-blue" alt="React Version">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.3-cyan" alt="Tailwind CSS">
</p>

---

## ✨ Overview

LinkSync is a revolutionary web-based tool that automates the entire process of designing and documenting Cisco network infrastructures. By simply providing your organizational requirements—such as the number of floors, departments, and desired services—LinkSync's AI engine generates a complete, enterprise-grade network plan.

This isn't just a diagramming tool. LinkSync provides a full suite of documentation, including an interactive topology map, a detailed IP addressing plan, a complete cabling guide, and most importantly, **ready-to-use, copy-and-paste CLI configurations for every single device in the network.**

**[➡️ View Live Demo on Vercel ([LinkSync](https://linksyncc.vercel.app/))]**

## 🚀 Key Features

* **AI-Powered Design:** Leverages the Gemini API to intelligently assist in the network design and modification process.
* **Multiple Design Tiers:** Choose from three pre-built templates to match your project's scale:
    * **SOHO:** A simple, flat network for small businesses or home labs.
    * **Standard Business:** A robust design with VLANs and inter-VLAN routing.
    * **Enterprise Grade:** A high-availability architecture with full redundancy and advanced security.
* **Interactive Topology Diagram:**
    * **Draggable Nodes:** Click and drag any device to rearrange the topology map.
    * **Informational Tooltips:** Hover over devices to see their model numbers.
* **Complete Configuration Generation:** Get full, copy-pastable CLI scripts for every device, including security best practices like `enable secret` and `service password-encryption`.
* **Detailed Documentation:** Automatically generates:
    * **Network IP Plan:** A clear table of all VLANs, subnets, gateways, and DHCP ranges.
    * **Cabling Guide:** A precise list of every connection and the required cable type.
* **Dynamic Cost Estimation:** Receive a realistic project budget based on the specific hardware in your generated design.
* **AI Chatbot for Reconfiguration:** Modify your design on the fly using natural language. Simply tell the AI assistant what to change, and it will instantly regenerate the entire project.
* **Immersive "Hacker" Theme:** A fully responsive, dark-mode UI with a "digital rain" background and glowing green accents for a unique user experience.

## 💻 Tech Stack

* **Frontend:** React.js
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **AI/LLM:** Google Gemini API

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v14 or later)
* npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/linksync.git](https://github.com/your-username/linksync.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd linksync
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```
4.  **Run the application:**
    ```bash
    npm start
    ```
    This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🚀 Deployment

This project is configured for easy deployment with **Vercel**.

1.  Push your code to your GitHub repository.
2.  Go to the [Vercel dashboard](https://vercel.com/new) and import your project from GitHub.
3.  Vercel will automatically detect that it's a React app and configure the build settings.
4.  Click **Deploy**, and you're done!

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*This project was developed with the assistance of an AI model from Google.*
