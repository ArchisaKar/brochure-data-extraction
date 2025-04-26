# Brochure Data Extraction

A tool for analyzing and extracting data from property brochures.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Node.js and npm
- Python 3.8 or higher
- A Google Gemini API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/ArchisaKar/brochure-data-extraction.git
   ```

2. Open the folder in your preferred code editor

3. Navigate to the project directory
   ```
   cd property-brochure-analyzer
   ```

### Frontend Setup

4. Install the required Node.js modules
   ```
   npm i
   ```

5. Start the development server
   ```
   npm run dev
   ```
   The application will be available at http://localhost:3000/

### Backend Setup

6. Get a Gemini API key from https://aistudio.google.com/apikey

7. Create a `.env` file in the property-brochure-analyzer folder with the following content:
   ```
   GEMINI_API_KEY = YOUR_API_KEY
   ```
   Replace `YOUR_API_KEY` with the API key you generated.

8. In a new terminal, install the required Python packages
   ```
   pip install -r requirements.txt
   ```

9. Start the FastAPI server
   ```
   uvicorn main:app --reload
   ```

## Usage

After completing the setup, you can use the application to analyze property brochures and extract relevant data.