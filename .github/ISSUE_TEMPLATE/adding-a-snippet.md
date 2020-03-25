---
name: Adding a snippet
about: Use this template to request addition of a snippet
title: Snippet request
labels: snippet-request
assignees: ''

---

Checklist: write DONE after the list item when you have done/accepted the condition for tooltip approval

1. Modify the snippet template following this checklist
2. Check that you have written the snippet code and content, or you own all intellectual property right for this snippet.
3. Check that you are allowed to release this snippet under CC0/Public domain licensing
4. Write that you, the author of this snippet, accept to waive all copyright and related or neighboring rights to the snippet, to the extent possible under law, just below this checklist.


-------


**Shorthand**: RdkitGenConfMMFFMinimize

**Title**: Generate a conformer and minimize with MMFF, using RDKit

**Authors**: @YOUR-GITHUB-HANDLE

**Description**: Generate a conformer of a RDKit molecule, then minimize it with
  the MMFF94 forcefield until convergence. NB: Might need to try/except for
  robustness.

**Code prelude (grayed out in snippet)**:

```
  from rdkit import Chem
  from rdkit.Chem import AllChem
  mol = Chem.MolFromSmiles("CCOCCO")
```

**Tooltip in code prelude - optional**

- Word-to-highlight: content of tooltip

**Main code**

```
  AllChem.EmbedMolecule(mol,
                      maxAttempts=200,
                      randomSeed=100,
                      useBasicKnowledge=True,
                      enforceChirality=True,
                      useRandomCoords=False,
                      clearConfs=1)
  res = AllChem.MMFFOptimizeMolecule(mol,
                                  mmffVariant="MMFF94",
                                  maxIters=500)
  if res == 1:
      print("Need more iteration to converge !")
```

**Tooltip in main code - optional**

- useBasicKnowledge: For complex molecules/macrocycles, set to False, and useRandomCoords to True
- Word-to-highlight: content of tooltip


**URL for further information**:

  - https://www.rdkit.org/docs/source/rdkit.Chem.rdDistGeom.html
  - https://www.rdkit.org/docs/source/rdkit.Chem.rdForceFieldHelpers.html

**Tools tags**

  - rdkit
  - python

**Subject tags**

  - MMFF
  - conformer
  - minimization

**Tooltip programming language**

python, shell, other ...
