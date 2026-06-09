:: Script to auto-run backend at your local system

python -m venv myenv
.\myenv\Scripts\pip.exe install -r requirements.txt
.\myenv\Scripts\python.exe -m fastapi dev --port 8084 --host 0.0.0.0

pause