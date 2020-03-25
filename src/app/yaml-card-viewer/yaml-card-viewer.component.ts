import { Component, OnInit } from '@angular/core';
import {SnippetData} from '../snippet-loader.service';
import YAML from 'yaml';
import { CodeEditorService, CodeModel } from '@ngstack/code-editor';

const emptySnippet = new SnippetData(
  '',
  '',
  '',
  '',
  '',
  [],
  '',
  [],
  [''],
  [''],
  [''],
  '');


@Component({
  selector: 'app-yaml-card-viewer',
  templateUrl: './yaml-card-viewer.component.html',
  styleUrls: ['./yaml-card-viewer.component.sass']
})
export class YamlCardViewerComponent implements OnInit {

  public snippet: SnippetData = emptySnippet;

  code = 'shorthand: RdkitGenConfMMFFMinimize\n' +
    'title: Generate a conformer and minimize with MMFF, using RDKit\n' +
    'authors: @ElianeBriand\n' +
    'description: |-\n' +
    '  Generate a conformer of a RDKit molecule, then minimize it with\n' +
    '  the MMFF94 forcefield until convergence. NB: Might need to try/except for\n' +
    '  robustness.\n' +
    'preludeCode: |+\n' +
    '  from rdkit import Chem\n' +
    '  from rdkit.Chem import AllChem\n' +
    '  mol = Chem.MolFromSmiles("CCOCCO")\n' +
    'preludeDetails: []\n' +
    'code: |+\n' +
    '  AllChem.EmbedMolecule(mol,\n' +
    '                      maxAttempts=200,\n' +
    '                      randomSeed=100,\n' +
    '                      useBasicKnowledge=True,\n' +
    '                      enforceChirality=True,\n' +
    '                      useRandomCoords=False,\n' +
    '                      clearConfs=1)\n' +
    '  res = AllChem.MMFFOptimizeMolecule(mol,\n' +
    '                                  mmffVariant="MMFF94",\n' +
    '                                  maxIters=500)\n' +
    '  if res == 1:\n' +
    '      print("Need more iteration to converge !")\n' +
    'codeDetails:\n' +
    '  - ["useBasicKnowledge", "For complex molecules/macrocycles, set to False, and useRandomCoords to True"]\n' +
    '  - ["maxIters", "500 to 2000 iters ought to be enough for most molecules"]\n' +
    'url:\n' +
    '  - https://www.rdkit.org/docs/source/rdkit.Chem.rdDistGeom.html\n' +
    '  - https://www.rdkit.org/docs/source/rdkit.Chem.rdForceFieldHelpers.html\n' +
    'tool:\n' +
    '  - rdkit\n' +
    '  - python\n' +
    'tags:\n' +
    '  - MMFF\n' +
    '  - conformer\n' +
    '  - minimization\n' +
    'highlightLang: python';

  public model: CodeModel = {value: this.code, language: 'yaml', uri: '', dependencies: [], schemas: []};

  theme = 'vs-dark';
  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  constructor() {
  }

  ngOnInit(): void {
    const objSnip = YAML.parse(this.code);
    this.snippet = objSnip;

  }


  onCodeChanged(value) {
    const objSnip = YAML.parse(value);
    this.snippet = objSnip;
  }

}
