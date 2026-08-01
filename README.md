# Team 1515 Mortorq Instructional Materials 

This repo holds all instructional materials for Team 1515 Mortorq, spanning traditional programming, AI/ML, Computer Vision/Perception, Agents, and Full-Stack development. 

## Curriculum Map

The curriculum is split into independent domains, each with its own README explaining how it's organized and what order to read it in. Most domains stand alone — jump to whichever one matches what you're working on rather than reading the repo cover to cover.

| Domain | Covers | Start here |
|---|---|---|
| [`git_resources/`](git_resources/README.md) | Version control: the git mental model, branching, merge vs. rebase, resolving conflicts, and this team's PR/commit conventions (`CONTRIBUTING.md`) | [`git_resources/README.md`](git_resources/README.md) |
| [`general_programming_resources/`](general_programming_resources/README.md) | Language-agnostic professional habits — debugging methodology, testing philosophy, reading unfamiliar code, technical communication, and more. A shelf, not a staircase: dip into whatever module is relevant, in any order | [`general_programming_resources/README.md`](general_programming_resources/README.md) |
| [`back_end_resources/`](back_end_resources/language_primer/README.md) | Java, Python, and C++ fundamentals (`language_primer/`), then the backend systems patterns — concurrency, PID, state machines, testing, fault tolerance — that keep code working live on a robot (`systems_primer/`) | [`back_end_resources/language_primer/README.md`](back_end_resources/language_primer/README.md) |
| [`frc_resources/`](frc_resources/README.md) | FRC's own tools and hardware ecosystem: Limelight, Roboflow, driver dashboards, WPILib's command-based architecture, the actual robot project layout and deploy workflow, and CAN-bus hardware debugging. Assumes `back_end_resources/systems_primer` | [`frc_resources/README.md`](frc_resources/README.md) |
| [`front_end_resources/`](front_end_resources/README.md) | HTML/CSS/JS/TypeScript/React, frontend systems thinking (real data, state, offline support, testing, deployment), and product design — all built around one real running app, the FRC scouting tool. Assumes `back_end_resources` | [`front_end_resources/README.md`](front_end_resources/README.md) |
| [`ml_resources/`](ml_resources/ml_primer/README.md) | ML fundamentals through linear algebra, computer vision, perception, deep learning, reinforcement learning, and generative AI architecture, plus deploying models to edge hardware (the same hardware `frc_resources/02_limelight` and `03_roboflow` build on) | [`ml_resources/ml_primer/README.md`](ml_resources/ml_primer/README.md) |
| [`ai_resources/`](ai_resources/ai_primer/README.md) | Using AI coding tools well day to day (`ai_primer/`), then how AI agents actually work and how to build one (`agent_primer/`) — more advanced, best treated as optional/after-fundamentals | [`ai_resources/ai_primer/README.md`](ai_resources/ai_primer/README.md) |

### Suggested path for a new programmer

1. **[`git_resources/`](git_resources/README.md)** and **[`general_programming_resources/01_shell_cli_literacy`](general_programming_resources/01_shell_cli_literacy/concept.md)** — the baseline tooling everything else assumes.
2. **[`back_end_resources/language_primer`](back_end_resources/language_primer/README.md)** — pick up Java first (it's what WPILib and the real robot code run), with Python and C++ alongside it.
3. **[`back_end_resources/systems_primer`](back_end_resources/systems_primer/README.md)** and **[`frc_resources/`](frc_resources/README.md)** together — these two lean on each other constantly (systems_primer's PID/state-machine theory, frc_resources' concrete WPILib/hardware instance of it), so it's worth going back and forth between them rather than finishing one before starting the other.
4. **Everything else** — `front_end_resources/`, `ml_resources/`, `ai_resources/`, and the rest of `general_programming_resources/` — in whatever order matches what you're actually working on. None of these three require finishing each other first.

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

