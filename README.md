# Team 1515 Mortorq Instructional Materials 

This repo holds all instructional materials for Team 1515 Mortorq, spanning traditional programming, AI/ML, Computer Vision/Perception, Agents, and Full-Stack development. 

## Environment Set-up 

To ensure all students have a consistent setup across **Mac, Windows, and Linux**, we use a **Python virtual environment** with dependencies defined in `requirements.txt`.

The instructions below walk you through:

1. Creating the Python environment
2. Installing required packages
3. Registering the environment as a **Jupyter kernel**
4. Running the notebooks

---

### Prerequisites

Before starting, make sure you have:

* **Python 3.10 – 3.12 installed** (used 3.11, so can stick to this) 
* **pip** available
* **Git** (optional but recommended)
* **JupyterLab** will be installed automatically via the environment (can also download Anaconda for an easier Jupyter GUI) 

You can check your Python version with:

```bash
python --version
```

---

### Create the Virtual Environment

From the root of the repository, create a virtual environment.

#### Mac / Linux

```bash
python3.11 -m venv .venv
```

#### Windows (PowerShell)

```powershell
py -m venv .venv
```

This creates a local environment in the `.venv/` folder.

### Activate the Environment

#### Mac / Linux

```bash
source .venv/bin/activate
```

#### Windows (PowerShell)

```powershell
.\.venv\Scripts\Activate.ps1
```

When the environment is active, your terminal prompt should begin with:

```
(.venv)
```

---

### Install Required Packages

Upgrade pip first:

```bash
python -m pip install --upgrade pip
```

Then install the dependencies:

```bash
pip install -r requirements.txt
```

---

### Register the Environment as a Jupyter Kernel

To allow Jupyter to use this environment, register it as a kernel:

```bash
python -m ipykernel install --user --name robotics-env --display-name "Python (Robotics Environment)"
```

Explanation:

* **vision-cnn** → internal kernel name
* **Python (vision-cnn)** → name shown inside Jupyter

---

#### Launch Jupyter

Start JupyterLab:

```bash
jupyter lab
```

A browser window will open automatically.

---

#### Select the Correct Kernel

When opening a notebook:

1. Go to **Kernel → Change Kernel**
2. Select

```
Python (vision-cnn)
```

This ensures the notebook uses the environment you created.

---

#### Verify the Installation

Run the following cell in a notebook to confirm the environment is working:

```python
import numpy as np
import matplotlib
import sklearn
import scipy
import cv2
import skimage
import tensorflow as tf

print("numpy:", np.__version__)
print("matplotlib:", matplotlib.__version__)
print("sklearn:", sklearn.__version__)
print("scipy:", scipy.__version__)
print("opencv:", cv2.__version__)
print("skimage:", skimage.__version__)
print("tensorflow:", tf.__version__)
```

If all imports succeed, your environment is ready.

---

### Deactivating the Environment

When finished working, you can exit the environment with:

```bash
deactivate
```

---

### Troubleshooting

#### Kernel not appearing in Jupyter

Run the kernel registration command again:

```bash
python -m ipykernel install --user --name robotics-env --display-name "Python (Robotics Environment)"
```

Restart Jupyter afterward.

---

#### OpenCV import error

If `cv2` fails to import:

```bash
pip install opencv-python
```

---

#### TensorFlow installation issues

Ensure you are using **Python 3.10–3.12**.

---

### Recommended Workflow

Each time you work with the notebooks:

1. Activate the environment

```bash
source .venv/bin/activate
```

2. Launch Jupyter

```bash
jupyter lab
```

3. Open the notebooks and ensure **Python (vision-cnn)** is selected.

--

