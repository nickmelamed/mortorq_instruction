# CV Resource Page 

The `cv_primer` will teach some basic Computer Vision concepts that will build a foundation for us to understand the higher-level Perception concepts for object detection in FIRST. 

## What is Computer Vision (CV)?

Computer Vision (CV) is a subfield of AI that focuses on processing digital images for information extraction. The purpose of this information is to perform tasks like detection and classification, where you can identify objects in an image. This has wide-ranging applications from medical to robotics.  

## Why should I care? 

CV is a must for understanding how to work with video and image inputs. Understanding how to classify objects will pave the way for building Perception for our robot, which is the intake of sensory information from an environment in order to perform tasks like object detection. 

So, if you understand these fundamental concepts, you can build a *very* powerful robot capable of navigating any situation. 

## Key Terms

A running glossary of vocabulary introduced across this primer, in the order you'll meet it. See also the [ml_primer](../ml_primer/README.md) glossary for terms like model, regression, classification, and regularization, which this primer builds on directly, and the [linear_algebra_primer](../linear_algebra_primer/README.md) glossary for the vector/matrix vocabulary (dot product, matrix-vector product) behind this primer's neuron and convolution math.

- **Pixel**: the smallest unit of an image - a single value (grayscale) or set of values (color) representing intensity/color at one point in a grid.
- **Grayscale**: an image with a single intensity channel per pixel ($H \times W$), rather than separate color channels.
- **RGB**: a color representation using Red, Green, and Blue intensity channels per pixel ($H \times W \times 3$).
- **Preprocessing**: transforming an image (blurring, denoising, brightness/contrast adjustment, etc.) to make it more suited for analysis or model-building.
- **Edge**: a region of an image with a rapid change in intensity, usually marking the boundary of an object.
- **Gradient**: the magnitude and direction of an intensity change in an image; the basis for edge detection.
- **Feature (image)**: a subset or transformation of an image's pixel grid (e.g., edges, color histograms) used as input to a classifier.
- **Neuron**: the basic unit of a neural network - weighted inputs, a bias term, and a nonlinear activation function.
- **Layer**: a group of neurons applying the same transformation; neural networks are compositions of layers.
- **Activation Function**: a nonlinear function applied between layers, allowing a neural network to model nonlinear relationships.
- **Convolution**: an operation that slides a small kernel across an image to produce a feature map, forming the basis of CNNs.
- **Kernel / Filter**: the small matrix of weights used in a convolution to detect a specific pattern (e.g., an edge).
- **Feature Map**: the output of applying a convolution kernel across an image.
- **CNN (Convolutional Neural Network)**: a neural network that uses convolutional layers to learn spatial features directly from images.
- **Pinhole Camera**: the simplest camera model - a box with a small hole that projects an inverted image onto a surface.
- **Perspective Projection**: the mapping of 3D real-world coordinates onto a 2D image plane via a camera.
- **Focal Length**: the distance between a camera's center and its image plane; controls how "zoomed in" an image is.
- **Principal Point**: the point where a camera's image plane intersects its principal (depth) axis - roughly the optical center of the image.
- **Perspective Distortion**: the effect where objects appear smaller as their distance from the camera increases, following the $1/Z$ relationship in the perspective projection equations.
- **Camera Intrinsics**: the camera-specific values (focal length in pixels, principal point in pixels) that convert geometric image-plane coordinates into pixel coordinates - what a camera calibration solves for.
- **Homography**: a mapping that relates the same 3D planar scene as captured in two different 2D images (e.g., for stitching or aligning camera views).