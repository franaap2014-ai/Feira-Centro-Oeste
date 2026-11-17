// Banco oficial FECHADO de 30 questões, 10 por tema.
// Clima, Biomas e Vegetação, Pontos Turísticos. Conteúdo e gabaritos protegidos.
export const BANK_TARGET=30;
export const BANK_CLOSED=true;
export const TOURISM_RESERVED_IDS=Object.freeze(Array.from({length:10},(_,i)=>'PT'+String(i+1).padStart(2,'0')));
export const categories=[
 {id:'clima',label:'Clima',icon:'🌦️',subtitle:'Clima e estações'},
 {id:'biomas_vegetacao',label:'Biomas e Vegetação',icon:'🌳',subtitle:'Cerrado, Pantanal e flora'},
 {id:'pontos_turisticos',label:'Pontos Turísticos',icon:'📍',subtitle:'Chapada dos Veadeiros, Brasília e turismo regional'}
];
export const isOfficialQuestion=value=>/^(?:CL|BV|PT)(?:0[1-9]|10)$/.test(typeof value==='string'?value:String(value?.id||''));
export const isFixedClimateQuestion=value=>/^CL(?:0[1-9]|10)$/.test(typeof value==='string'?value:String(value?.id||''));
export const questions=Object.freeze([
 {id:'CL01',category:'clima',text:"Qual é o clima predominante na região Centro-Oeste?",options:["Equatorial","Tropical","Subtropical","Semiárido"],correct:1,fact:'',fixed:true},
 {id:'CL02',category:'clima',text:"Como são as estações do ano no Centro-Oeste?",options:["Verão seco e inverno chuvoso","Frio o ano inteiro","Verão chuvoso e inverno seco","Chuva durante todo o ano"],correct:2,fact:'',fixed:true},
 {id:'CL03',category:'clima',text:"Qual é o principal bioma da região Centro-Oeste?",options:["Amazônia","Caatinga","Pampa","Cerrado"],correct:3,fact:'',fixed:true},
 {id:'CL04',category:'clima',text:"Qual característica é comum na vegetação do Cerrado?",options:["Árvores baixas, troncos retorcidos e gramíneas","Árvores muito altas e folhas largas","Vegetação formada apenas por cactos","Florestas cobertas de neve"],correct:0,fact:'',fixed:true},
 {id:'CL05',category:'clima',text:"Qual bioma brasileiro é conhecido por suas áreas alagadas?",options:["Mata Atlântica","Pantanal","Caatinga","Pampa"],correct:1,fact:'',fixed:true},
 {id:'CL06',category:'clima',text:"Qual é uma característica do clima do Pantanal?",options:["Temperaturas muito baixas","Pouca variação de temperatura","Períodos de cheia e seca","Neve durante o inverno"],correct:2,fact:'',fixed:true},
 {id:'CL07',category:'clima',text:"Qual bioma também está presente na região Centro-Oeste, principalmente em Mato Grosso?",options:["Amazônia","Pampa","Caatinga","Mata de Araucárias"],correct:0,fact:'',fixed:true},
 {id:'CL08',category:'clima',text:"Por que muitas plantas do Cerrado possuem raízes profundas?",options:["Para alcançar água em camadas profundas do solo","Para sobreviver à neve","Para evitar o contato com o sol","Para viver dentro da água"],correct:0,fact:'',fixed:true},
 {id:'CL09',category:'clima',text:"Qual fenômeno natural é comum no Cerrado durante a estação seca?",options:["Nevascas","Geadas constantes","Tempestades de neve","Queimadas"],correct:3,fact:'',fixed:true},
 {id:'CL10',category:'clima',text:"Quais são os três principais biomas encontrados na região Centro-Oeste?",options:["Caatinga, Pampa e Mata Atlântica","Cerrado, Pantanal e Amazônia","Pampa, Cerrado e Caatinga","Amazônia, Pampa e Caatinga"],correct:1,fact:'',fixed:true},
 {id:'BV01',category:'biomas_vegetacao',text:"Qual é a vegetação predominante na Região Centro-Oeste?",options:["Caatinga","Cerrado","Mata Atlântica","Pampas"],correct:1,fact:'',fixed:true},
 {id:'BV02',category:'biomas_vegetacao',text:"Qual é uma característica do Cerrado?",options:["Árvores baixas e troncos retorcidos","Muitas árvores cobertas de neve","Vegetação totalmente rasteira","Florestas muito fechadas e úmidas"],correct:0,fact:'',fixed:true},
 {id:'BV03',category:'biomas_vegetacao',text:"Qual bioma também está presente no Centro-Oeste?",options:["Pampa","Pantanal","Mata de Araucárias","Manguezal"],correct:1,fact:'',fixed:true},
 {id:'BV04',category:'biomas_vegetacao',text:"Como é a vegetação do Pantanal?",options:["Apenas cactos","Somente árvores altas","Mistura de campos, árvores e plantas aquáticas","Apenas gramíneas secas"],correct:2,fact:'',fixed:true},
 {id:'BV05',category:'biomas_vegetacao',text:"Qual fator influencia a vegetação do Cerrado?",options:["Neve constante","Clima tropical, com períodos secos e chuvosos","Frio intenso durante todo o ano","Clima polar"],correct:1,fact:'',fixed:true},
 {id:'BV06',category:'biomas_vegetacao',text:"Qual planta é comum no Cerrado?",options:["Pequi","Pinheiro","Maçã","Oliveira"],correct:0,fact:'',fixed:true},
 {id:'BV07',category:'biomas_vegetacao',text:"O que acontece com muitas plantas do Cerrado durante a seca?",options:["Crescem debaixo da água","Adaptam-se à falta de água","Ficam cobertas de neve","Desaparecem completamente"],correct:1,fact:'',fixed:true},
 {id:'BV08',category:'biomas_vegetacao',text:"Qual é uma ameaça à vegetação do Centro-Oeste?",options:["Desmatamento","Nevascas","Terremotos","Geleiras"],correct:0,fact:'',fixed:true},
 {id:'BV09',category:'biomas_vegetacao',text:"Qual estado brasileiro possui grande parte do Pantanal?",options:["São Paulo","Mato Grosso do Sul","Paraná","Rio de Janeiro"],correct:1,fact:'',fixed:true},
 {id:'BV10',category:'biomas_vegetacao',text:"Por que a vegetação do Centro-Oeste é importante?",options:["Porque não possui animais","Porque serve apenas para decoração","Porque abriga animais e mantém o equilíbrio ambiental","Porque impede todas as chuvas"],correct:2,fact:'',fixed:true},
 {id:'PT01',category:'pontos_turisticos',text:"Qual estado brasileiro abriga a Chapada dos Veadeiros?",options:["Mato Grosso","Goiás","Minas Gerais","São Paulo"],correct:1,fact:'',fixed:true},
 {id:'PT02',category:'pontos_turisticos',text:"O que os turistas encontram na Chapada dos Veadeiros?",options:["Praias de mar","Montanhas com neve","Cachoeiras e trilhas","Grandes geleiras"],correct:2,fact:'',fixed:true},
 {id:'PT03',category:'pontos_turisticos',text:"Qual é o bioma do Parque Nacional da Chapada dos Veadeiros?",options:["Pampa","Caatinga","Cerrado","Mata Atlântica"],correct:2,fact:'',fixed:true},
 {id:'PT04',category:'pontos_turisticos',text:"Qual cidade é uma das principais bases para visitar a Chapada dos Veadeiros?",options:["Curitiba","Alto Paraíso de Goiás","Recife","São Paulo"],correct:1,fact:'',fixed:true},
 {id:'PT05',category:'pontos_turisticos',text:"Qual atração da Chapada dos Veadeiros tem rochas que lembram a superfície da Lua?",options:["Vale da Lua","Praia das Conchas","Serra de Gelo","Lago das Estrelas"],correct:0,fact:'',fixed:true},
 {id:'PT06',category:'pontos_turisticos',text:"Qual é a capital do Brasil?",options:["Brasília","Goiânia","Rio de Janeiro","Salvador"],correct:0,fact:'',fixed:true},
 {id:'PT07',category:'pontos_turisticos',text:"Brasília fica em qual unidade federativa?",options:["Distrito Federal","Goiás","Mato Grosso","Mato Grosso do Sul"],correct:0,fact:'',fixed:true},
 {id:'PT08',category:'pontos_turisticos',text:"Qual destes pontos turísticos fica em Brasília?",options:["Torre Eiffel","Coliseu","Congresso Nacional","Torre de Pisa"],correct:2,fact:'',fixed:true},
 {id:'PT09',category:'pontos_turisticos',text:"Em qual região brasileira ficam a Chapada dos Veadeiros e Brasília?",options:["Nordeste","Centro-Oeste","Sul","Norte"],correct:1,fact:'',fixed:true},
 {id:'PT10',category:'pontos_turisticos',text:"Ao visitar um parque natural como a Chapada dos Veadeiros, qual atitude ajuda a preservar o lugar?",options:["Deixar lixo nas trilhas","Arrancar plantas do caminho","Recolher o lixo e respeitar as trilhas","Alimentar os animais silvestres"],correct:2,fact:'',fixed:true},
].map(q=>Object.freeze({...q,options:Object.freeze([...q.options])})));

export function validateBank(bank=questions){
 const touring=bank.filter(q=>q.category==='pontos_turisticos').length;
 if(bank.length!==BANK_TARGET)throw new Error('Banco fechado exige 30 perguntas.');
 if(touring!==10)throw new Error('Pontos Turísticos exige dez perguntas.');
 for(const cat of categories){
  const count=bank.filter(q=>q.category===cat.id).length;
  if(count!==(cat.id==='pontos_turisticos'?touring:10))throw new Error('Quantidade incorreta: '+cat.label);
 }
 const ids=new Set();
 for(const q of bank){
  if(ids.has(q.id))throw new Error('ID duplicado '+q.id);ids.add(q.id);
  if(!q.text?.trim()||!Array.isArray(q.options)||q.options.length!==4||new Set(q.options).size!==4||!Number.isInteger(q.correct)||q.correct<0||q.correct>3)throw new Error('Pergunta inválida '+q.id);
  if(!isOfficialQuestion(q)||q.fixed!==true)throw new Error('Questão não oficial ou desbloqueada: '+q.id);
  if(q.category==='pontos_turisticos'&&!TOURISM_RESERVED_IDS.includes(q.id))throw new Error('ID de turismo inválido');
 }
 return true;
}
export function shuffle(input,rng=Math.random){
 const copy=[...input];for(let i=copy.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;
}
function answered(q,rng){return {...q,answers:shuffle(q.options.map((text,original)=>({id:q.id+'-'+original,text,correct:original===q.correct})),rng)}}
function five(bank,rng){
 const eligible=questions.filter(q=>q.options?.length===4&&q.text?.trim());
 if(eligible.length<5)throw new Error('Ainda não há cinco perguntas disponíveis.');
 const selected=[];
 // Um sorteio de cada um dos três temas, mais dois entre as demais.
 // As perguntas e gabaritos oficiais nunca são alterados.
 for(const c of categories){
  const group=eligible.filter(q=>q.category===c.id);
  if(group.length)selected.push(group[Math.floor(rng()*group.length)]);
 }
 const used=new Set(selected.map(q=>q.id));
 for(const q of shuffle(eligible.filter(q=>!used.has(q.id)),rng)){if(selected.length===5)break;selected.push(q);used.add(q.id)}
 if(selected.length!==5)throw new Error('Não foi possível selecionar cinco questões.');
 return shuffle(selected.map(q=>answered(q,rng)),rng);
}
export function makeSession(bank=questions,rng=Math.random){return five(bank,rng)}
validateBank();
export function makeFlexibleSession(bank,rng=Math.random){return five(bank,rng)}
