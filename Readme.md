
# Project Setup Instructions

Follow the steps below to set up and run the project:

## Backend Setup

1. **Open the backend folder:**
   Navigate to the backend folder of the project.

2. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   ```

3. **Activate the virtual environment:**
   - For **Linux/Mac**:
     ```bash
     source .venv/bin/activate
     ```
   - For **Windows**:
     ```bash
     .venv\Scripts\activate
     ```

4. **Install required packages:**
   ```bash
   pip install flask flask_jwt_extended flask_cors flask_sqlalchemy sqlalchemy validators textblob
   ```

5. **Run the application:**
   ```bash
   python app.py
   ```

## Frontend Setup

6. **Open the frontend folder:**
   Navigate to the frontend folder of the project.

7. **Install dependencies:**
   ```bash
   npm install
   ```

8. **Run the development server:**
   ```bash
   npm run dev
   ```

## Default Credentials

- **Email:** mridul@gmail.com
- **Username:** mridul2002
- **Password:** pass

## Application Usage

- You can view all the information on the **Dashboard** and **Analytics** pages.
- If you wish to log out, click on the user icon in the top right corner, then select the **Logout** button.
