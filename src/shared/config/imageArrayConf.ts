
const IMAGE_ARRAY_LENGTH = 9;

const SCREEN_BUTTONS =9;

const IMAGE_ARRAY_BUTTON_MAPPING: number[] = [8, 7, 6, 5, 4, 3, 2, 1, 0];


const KEYBOARD_KEYS_LENGTH = 120;

type KeyboardKeyType = {
    nKeyId: number;
    keyText: string;
};

export interface KeyboardKeyArrayInterface {
    [key: string]: KeyboardKeyType;
}


const KEYBOARD_KEY_ARRAY: KeyboardKeyArrayInterface = {
    'Esc':{nKeyId:14, keyText:'Esc'},
    'F1':{nKeyId:10, keyText:'F1'},
    'F2':{nKeyId:6, keyText:'F2'},
    'F3':{nKeyId:0, keyText:'F3'},
    'F4':{nKeyId:62, keyText:'F4'},
    'F5':{nKeyId:58, keyText:'F5'},
    'F6':{nKeyId:54, keyText:'F6'},
    'F7':{nKeyId:48, keyText:'F7'},
    'F8':{nKeyId:15, keyText:'F8'},
    'F9':{nKeyId:11, keyText:'F9'},
    'F10':{nKeyId:7, keyText:'F10'},
    'F11':{nKeyId:1, keyText:'F11'},
    'F12':{nKeyId:63, keyText:'F12'},

     '`':{nKeyId:12, keyText:'`'},
    '1':{nKeyId:8, keyText:'1'},
    '2':{nKeyId:2, keyText:'2'},
    '3':{nKeyId:4, keyText:'3'},
    '4':{nKeyId:60, keyText:'4'},
    '5':{nKeyId:56, keyText:'5'},
    '6':{nKeyId:50, keyText:'6'},
    '7':{nKeyId:52, keyText:'7'},
    '8':{nKeyId:13, keyText:'8'},
    '9':{nKeyId:9, keyText:'9'},
    '0':{nKeyId:3, keyText:'0'},
    '-':{nKeyId:5, keyText:'-'},
    '=':{nKeyId:61, keyText:'='},
    'Backspace':{nKeyId:57, keyText:'Backspace'},

    'Tab':{nKeyId:30, keyText:'Tab'},
    'Q':{nKeyId:26, keyText:'Q'}, 
    'W':{nKeyId:22, keyText:'W'}, 
    'E':{nKeyId:16, keyText:'E'}, 
    'R':{nKeyId:78, keyText:'R'}, 
    'T':{nKeyId:74, keyText:'T'}, 
    'Y':{nKeyId:70, keyText:'Y'}, 
    'U':{nKeyId:64, keyText:'U'}, 
    'I':{nKeyId:31, keyText:'I'}, 
    'O':{nKeyId:27, keyText:'O'}, 
    'P':{nKeyId:23, keyText:'P'}, 
    '[':{nKeyId:17, keyText:'['}, 
    ']':{nKeyId:79, keyText:']'}, 
    '\\':{nKeyId:75, keyText:'\\'},

    'Caps':{nKeyId:28, keyText:'Caps'}, 
    'A':{nKeyId:24, keyText:'A'}, 
    'S':{nKeyId:18, keyText:'S'}, 
    'D':{nKeyId:20, keyText:'D'}, 
    'F':{nKeyId:76, keyText:'F'}, 
    'G':{nKeyId:72, keyText:'G'}, 
    'H':{nKeyId:66, keyText:'H'}, 
    'J':{nKeyId:68, keyText:'J'}, 
    'K':{nKeyId:29, keyText:'K'}, 
    'L':{nKeyId:25, keyText:'L'}, 
    ';':{nKeyId:19, keyText:';'},
    "'":{nKeyId:21, keyText:"'"}, 
    'Enter':{nKeyId:73, keyText:'Enter'},

    'ShiftL':{nKeyId:42, keyText:'ShiftL'}, 
    'Z':{nKeyId:38, keyText:'Z'}, 
    'X':{nKeyId:32, keyText:'X'}, 
    'C':{nKeyId:90, keyText:'C'}, 
    'V':{nKeyId:86, keyText:'V'}, 
    'B':{nKeyId:80, keyText:'B'}, 
    'N':{nKeyId:82, keyText:'N'}, 
    'M':{nKeyId:84, keyText:'M'}, 
    ',':{nKeyId:43, keyText:','}, 
    '.':{nKeyId:39, keyText:'.'}, 
    '/': { nKeyId : 33 , keyText : '/' }, 
    'ShiftR' : { nKeyId : 91 , keyText : "ShiftR" },

    'CtrlL' : { nKeyId: 40 , keyText : "CtrlL" }, 
    'Win' : { nKeyId : 36 , keyText : "Win" }, 
    'AltL' : { nKeyId : 34 , keyText : "AltL" }, 
    'Space' : { nKeyId : 88 , keyText : "Space" }, 
    'AltR' : { nKeyId : 41 , keyText : "AltR" }, 
    'Fn' : { nKeyId : 37 , keyText : "Fn" }, 
    'Code' : { nKeyId : 35, keyText : "Code" }, 
    'CtrlR' : { nKeyId : 89 , keyText :"CtrlR"},

    'Print':{ nKeyId : 59 , keyText : "Print" }, 
    'Scroll':{ nKeyId : 55 , keyText : "Scroll" }, 
    'Pause':{ nKeyId : 49 , keyText : "Pause" },
    'Insert':{ nKeyId : 51 , keyText : "Insert" }, 
    'Home':{ nKeyId : 53 , keyText : "Home" }, 
    'PageUp':{ nKeyId : 69 , keyText : "PgUp" },
    'Delete':{ nKeyId : 71 , keyText : "Delete" }, 
    'End':{ nKeyId : 65 , keyText : "End" }, 
    'PageDown':{ nKeyId : 67 , keyText : "PgDown" },
    'ArrowUp':{ nKeyId : 87 , keyText : "\u2191" },
    'ArrowLeft':{ nKeyId : 81 , keyText : "\u2190" }, 
    'ArrowDown':{ nKeyId : 83 , keyText : "\u2193" }, 
    'ArrowRight':{ nKeyId : 85 , keyText : "\u2192" },

    // 'FnA':{ nKeyId: 13 , keyText: "FnA" }, 
    // 'FnB':{ nKeyId: 37 , keyText: "FnB" }, 
    // 'FnC':{ nKeyId: 61 , keyText: "FnC" }, 
    // 'FnD':{ nKeyId: 85 , keyText: "FnD" },

    // 'NumLock':{ nKeyId: 15, keyText: "NmLck"}, 
    // '/N': {nKeyId: 39, keyText:"/"}, 
    // '*N': {nKeyId: 63, keyText:"*"}, 
    // '-N': {nKeyId: 87, keyText:"-"},
    // '7N':{nKeyId: 17, keyText:"7"}, 
    // '8N':{nKeyId: 41, keyText:"8"}, 
    // '9N':{nKeyId: 65, keyText:"9"}, 
    // '+N':{nKeyId: 89, keyText:"+"},
    // '4N':{nKeyId: 19, keyText:"4"}, 
    // '5N':{nKeyId: 43, keyText:"5"}, 
    // '6N':{nKeyId: 67, keyText:"6"},
    // '1N':{nKeyId: 21, keyText:"1"}, 
    // '2N':{nKeyId: 45, keyText:"2"}, 
    // '3N':{nKeyId: 69, keyText:"3"}, 
    // 'EnterN':{nKeyId: 93, keyText:"Enter"},
    // '0N':{nKeyId: 47, keyText:"0"}, 
    // '.N':{nKeyId: 71, keyText:"."},

    // 'FnE':{nKeyId: 109, keyText:"FnE"}, 
    // 'FnF':{nKeyId: 111, keyText:"FnF"}, 
    // 'FnG':{nKeyId: 113, keyText:"FnG"}, 
    // 'FnH':{nKeyId: 115, keyText:"FnH"},
    // 'FnI':{nKeyId: 117, keyText:"FnI"},
    // 'FnJ':{nKeyId: 119, keyText:"FnJ"}
};

export { IMAGE_ARRAY_LENGTH ,SCREEN_BUTTONS,KEYBOARD_KEYS_LENGTH,KEYBOARD_KEY_ARRAY, IMAGE_ARRAY_BUTTON_MAPPING };