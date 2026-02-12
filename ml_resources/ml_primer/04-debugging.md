# Debugging ML 

Debugging ML systems can be a little strange, because most of the time you are likely not going to be fixing your actual code; instead, you are going to be working on fixing your data and your model parameters.

## Debug Order

Below is a good way to verify performance: 

1. Data quality
2. Labels
3. Training behavior
4. Metrics
5. Deployment conditions

You can simplify this further to data -> performance -> generalizability. 

## Visualization

Always visualize:
- Predictions
- Errors
- Failure cases

If you cannot see failures, you cannot fix them. Visualizations like confusion matrices, line plots, bar charts, contour plots, etc. can all have their place! 