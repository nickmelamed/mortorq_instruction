# Why Version Control Exists

Before Git, teams shared code by:
- Emailing files
- Copying folders (`final_final_v3`)
- Manually merging changes

This does not scale at all. Frankly, it is terrible even with a few files. 

Version control solves three fundamental problems:

## 1. History
- What changed?
- When?
- Why?
- By whom?

Git stores **snapshots of your project over time**, not just files. You know exactly what changed, who made the change, when they made it, and (ideally) why they made it. 

## 2. Collaboration
- Work simultaneously
- Avoid overwriting each other
- Review changes before merging

Version control is meant to foster collaboration by allowing people to work on the same projects, at the same time, without undoing another person's progress. Also, all of these changes are reviewable. 

## 3. Safety
- Experiment without fear
- Undo mistakes
- Recover deleted work

Git is not about saving files, it is about **managing change safely**. You are free to play around with code, try out new configurations, delete and recover, and much more. 

If you remember nothing else from this primer, remember managing change safely. Syntax can always be looked up later! 

## Resources
- **Official docs:** [Pro Git, Ch. 1 - About Version Control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) - the canonical explanation of local, centralized, and distributed version control.
- **Blog:** [What is Version Control? - Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials/what-is-version-control) - a shorter, more practical take on the same ideas.
- **Research paper:** Koc, A. & Tansel, A.U. (2011). ["A Survey of Version Control Systems"](https://www.iiis.org/cds2011/cd2011imc/iceme_2011/paperspdf/fb394vz.pdf) - traces the history of VCS tools from early systems like RCS through distributed systems like Git.

