import { makeTrigger } from "../toneView/makeView.js";
import { simpleTable } from "../simpleTable/simpleTable.js";
import { toneView } from "../toneView/toneView.js";
import { initializeToneView, clickButton, selectListObjectArray } from "../toneView/initializeView.js";
import {trueOp} from './trueOp.js'

const anop = trueOp(); //new Tone.OmniOscillator({}).toDestination()//
let anopGet= Object.assign ({}, anop.get(), {name:anop.name});

anop.debug=true;
//anop.start();
const view = new simpleTable(anopGet, selectListObjectArray, anop);

makeTrigger(anop);