// Banco de 40 perguntas: 8 por categoria. ID e resposta corretos independem da posição exibida.
export const categories = [
  {id:'geografia', label:'Geografia', icon:'🗺️', subtitle:'Território e natureza'},
  {id:'culinaria', label:'Culinária', icon:'🍲', subtitle:'Sabores da região'},
  {id:'costumes', label:'Costumes', icon:'🎶', subtitle:'Tradições e cultura'},
  {id:'vestimentas', label:'Vestimentas', icon:'👒', subtitle:'Trajes e tradições'},
  {id:'brasilia', label:'Brasília', icon:'🏛️', subtitle:'Nossa capital'},
];
// Each correct value is the index in the original options, not a displayed button position.
export const questions = [
  {id:'G01',category:'geografia',text:'Quais estados fazem parte da Região Centro-Oeste?',options:['Goiás, Mato Grosso e Mato Grosso do Sul','Paraná, Goiás e Bahia','São Paulo, Goiás e Pará','Mato Grosso, Tocantins e Minas Gerais'],correct:0,fact:'Além desses três estados, a região inclui o Distrito Federal.'},
  {id:'G02',category:'geografia',text:'Qual é a capital de Mato Grosso?',options:['Goiânia','Campo Grande','Cuiabá','Palmas'],correct:2,fact:'Cuiabá é a capital do estado de Mato Grosso.'},
  {id:'G03',category:'geografia',text:'Qual é a capital de Mato Grosso do Sul?',options:['Cuiabá','Campo Grande','Goiânia','Corumbá'],correct:1,fact:'Campo Grande é a capital de Mato Grosso do Sul.'},
  {id:'G04',category:'geografia',text:'Qual é a capital de Goiás?',options:['Anápolis','Goiânia','Brasília','Rio Verde'],correct:1,fact:'Goiânia é a capital de Goiás; Brasília é a capital do Brasil.'},
  {id:'G05',category:'geografia',image:'assets/pantanal.svg',text:'O Pantanal brasileiro ocupa principalmente áreas de quais estados?',options:['Goiás e Tocantins','Goiás e Mato Grosso','Mato Grosso e Mato Grosso do Sul','Minas Gerais e Bahia'],correct:2,fact:'O Pantanal está presente sobretudo em Mato Grosso e Mato Grosso do Sul.'},
  {id:'G06',category:'geografia',image:'assets/cerrado.svg',text:'Observe a ilustração: qual bioma do Centro-Oeste está representado?',options:['Mata Atlântica','Cerrado','Caatinga','Pampa'],correct:1,fact:'O Cerrado ocupa grande parte do Centro-Oeste brasileiro.'},
  {id:'G07',category:'geografia',text:'Em qual unidade federativa fica a capital do Brasil?',options:['Goiás','Distrito Federal','Mato Grosso','Mato Grosso do Sul'],correct:1,fact:'Brasília fica no Distrito Federal.'},
  {id:'G08',category:'geografia',text:'Quantas unidades federativas compõem o Centro-Oeste, contando o Distrito Federal?',options:['Três','Cinco','Quatro','Seis'],correct:2,fact:'São três estados e o Distrito Federal, totalizando quatro unidades federativas.'},

  {id:'C01',category:'culinaria',image:'assets/pequi.svg',text:'Qual fruto do Cerrado é muito usado no arroz típico de Goiás?',options:['Pequi','Maçã','Morango','Pêssego'],correct:0,fact:'O pequi é um fruto típico do Cerrado, presente em preparações regionais.'},
  {id:'C02',category:'culinaria',text:'O empadão goiano é um prato tradicional de qual estado?',options:['Mato Grosso','Goiás','Acre','Rio Grande do Sul'],correct:1,fact:'O empadão goiano é uma preparação tradicional de Goiás.'},
  {id:'C03',category:'culinaria',text:'No prato “arroz com pequi”, qual ingrediente dá nome à receita?',options:['Feijão','Carne de sol','Pequi','Milho'],correct:2,fact:'A receita leva arroz e pequi, fruto do Cerrado.'},
  {id:'C04',category:'culinaria',text:'A chipa, popular em Mato Grosso do Sul, é geralmente preparada com...',options:['Polvilho e queijo','Macarrão e tomate','Peixe cru','Batata e chocolate'],correct:0,fact:'A chipa tem tradição na região de fronteira e costuma levar polvilho e queijo.'},
  {id:'C05',category:'culinaria',text:'Apesar do nome, a “sopa paraguaia” tradicional é...',options:['Uma bebida gelada','Um caldo servido em tigela','Um prato assado à base de milho','Uma sobremesa de frutas'],correct:2,fact:'A sopa paraguaia é um prato salgado assado bastante conhecido em Mato Grosso do Sul.'},
  {id:'C06',category:'culinaria',text:'A mojica de pintado é preparada principalmente com qual alimento?',options:['Peixe','Carne de porco','Banana','Frango'],correct:0,fact:'O pintado é um peixe utilizado em receitas tradicionais, inclusive em Mato Grosso.'},
  {id:'C07',category:'culinaria',text:'Qual bebida com erva-mate e água fria é muito popular em Mato Grosso do Sul?',options:['Chocolate quente','Tereré','Café com leite','Suco de caju'],correct:1,fact:'O tereré é tradicionalmente preparado com erva-mate e água fria.'},
  {id:'C08',category:'culinaria',text:'A guariroba, encontrada em receitas goianas, é um tipo de...',options:['Queijo','Peixe','Palmito','Cereal'],correct:2,fact:'A guariroba é uma palmeira cujo palmito de sabor amargo integra pratos regionais.'},

  {id:'T01',category:'costumes',text:'A catira é uma manifestação cultural marcada principalmente por...',options:['Sapateado e palmas','Dança com leques','Roda de capoeira','Música instrumental sem dança'],correct:0,fact:'A catira usa movimentos dos pés e palmas, frequentemente ao som da viola.'},
  {id:'T02',category:'costumes',text:'Qual instrumento é muito associado à música caipira e à catira?',options:['Harpa celta','Viola caipira','Gaita de foles','Saxofone'],correct:1,fact:'A viola caipira acompanha muitas manifestações musicais da região.'},
  {id:'T03',category:'costumes',image:'assets/cavalhadas.svg',text:'As Cavalhadas de Pirenópolis são uma tradição cultural de qual estado?',options:['Goiás','Mato Grosso do Sul','Mato Grosso','Distrito Federal'],correct:0,fact:'As Cavalhadas de Pirenópolis são uma celebração tradicional em Goiás.'},
  {id:'T04',category:'costumes',text:'Compartilhar uma roda de tereré é um costume muito presente em...',options:['Mato Grosso do Sul','Pará','Maranhão','Pernambuco'],correct:0,fact:'O tereré integra o convívio social em Mato Grosso do Sul.'},
  {id:'T05',category:'costumes',text:'O siriri é conhecido como uma expressão tradicional de...',options:['Dança e música','Arquitetura moderna','Escalada esportiva','Cinema mudo'],correct:0,fact:'O siriri é uma manifestação de dança e música popular em Mato Grosso.'},
  {id:'T06',category:'costumes',text:'O cururu, presente em tradições de Mato Grosso, está relacionado a...',options:['Canto e música popular','Corrida de automóveis','Mergulho no mar','Pintura digital'],correct:0,fact:'O cururu é uma manifestação musical tradicional, com cantoria.'},
  {id:'T07',category:'costumes',text:'A Folia de Reis, celebrada em partes do Centro-Oeste, está ligada a...',options:['Uma tradição popular religiosa','Um festival gastronômico','Uma competição de rodeio','Uma festa de colheita'],correct:0,fact:'A Folia de Reis é uma tradição popular religiosa presente em várias regiões do Brasil.'},
  {id:'T08',category:'costumes',text:'No Pantanal, o modo de vida tradicional de muitos trabalhadores rurais está ligado a...',options:['Criação de gado','Mineração de sal-gema','Cultivo de trigo em estufas','Pesca em mar aberto'],correct:0,fact:'A pecuária faz parte da história e da cultura pantaneira.'},

  {id:'V01',category:'vestimentas',image:'assets/pantaneiro.svg',text:'Qual acessório ajuda a proteger do sol os trabalhadores rurais do Pantanal?',options:['Chapéu de abas largas','Chapéu de festa junina de palha fina','Boné de ciclista','Capuz de tecido leve'],correct:0,fact:'Chapéus de abas largas são úteis no trabalho ao ar livre no Pantanal.'},
  {id:'V02',category:'vestimentas',text:'Em atividades rurais pantaneiras, as botas são usadas principalmente para...',options:['Proteger os pés','Ajudar na navegação','Identificar a região de origem','Substituir as esporas'],correct:0,fact:'As botas oferecem proteção aos pés durante as atividades no campo.'},
  {id:'V03',category:'vestimentas',text:'Por que calças compridas são comuns no trabalho a cavalo?',options:['Ajudam a proteger as pernas','São exclusivas para festas','Impedem o uso de botas','Servem para identificar a cidade'],correct:0,fact:'Calças compridas podem ajudar na proteção das pernas durante cavalgadas.'},
  {id:'V04',category:'vestimentas',text:'Nas Cavalhadas de Pirenópolis, os participantes a cavalo usam...',options:['Trajes elaborados que representam cavaleiros','Trajes típicos de dança de salão','Roupas de pescadores','Uniformes de bandas marciais'],correct:0,fact:'As Cavalhadas apresentam cavaleiros com trajes cerimoniais e ornamentados.'},
  {id:'V05',category:'vestimentas',text:'Nas quadrilhas de festas juninas da região, é comum ver...',options:['Vestidos rodados e trajes caipiras','Trajes de capoeira','Uniformes de futebol','Roupas de formatura'],correct:0,fact:'As quadrilhas juninas usam figurinos festivos de inspiração caipira em várias regiões.'},
  {id:'V06',category:'vestimentas',text:'Em apresentações tradicionais de siriri, um elemento frequente do figurino feminino é...',options:['Saia rodada e colorida','Saia de couro rígido','Uniforme escolar','Vestimenta de trabalho industrial'],correct:0,fact:'O figurino do siriri frequentemente usa saias rodadas e cores vivas.'},
  {id:'V07',category:'vestimentas',text:'Qual material aparece historicamente em peças resistentes usadas no trabalho rural?',options:['Couro','Seda fina','Papel decorado','Linho transparente'],correct:0,fact:'O couro foi usado em diferentes itens e acessórios de trabalho rural.'},
  {id:'V08',category:'vestimentas',text:'Sobre os trajes tradicionais do Centro-Oeste, qual afirmação está correta?',options:['Variam de acordo com a tradição e a comunidade','Todos os moradores usam a mesma roupa típica','Existe apenas um traje oficial para toda a região','Todas as roupas típicas são feitas de seda'],correct:0,fact:'A região apresenta muitas culturas e tradições, sem um único traje para todos.'},

  {id:'B01',category:'brasilia',image:'assets/congresso.svg',text:'Em que ano Brasília foi inaugurada como capital do Brasil?',options:['1889','1960','2000','1822'],correct:1,fact:'Brasília foi inaugurada em 21 de abril de 1960.'},
  {id:'B02',category:'brasilia',text:'Quem projetou importantes edifícios modernistas de Brasília?',options:['Oscar Niemeyer','Aleijadinho','Machado de Assis','Cândido Portinari'],correct:0,fact:'Oscar Niemeyer projetou importantes edifícios públicos da capital.'},
  {id:'B03',category:'brasilia',text:'Quem elaborou o Plano Piloto de Brasília?',options:['Lúcio Costa','Santos Dumont','Tarsila do Amaral','Monteiro Lobato'],correct:0,fact:'O urbanista Lúcio Costa foi o autor do Plano Piloto vencedor do concurso.'},
  {id:'B04',category:'brasilia',text:'Qual poder da República tem sua sede no Congresso Nacional?',options:['Poder Legislativo','Poder Judiciário apenas','Poder Executivo apenas','Poder Moderador'],correct:0,fact:'O Congresso Nacional abriga a Câmara dos Deputados e o Senado Federal.'},
  {id:'B05',category:'brasilia',text:'Qual edifício de Brasília é conhecido por sua estrutura de colunas curvas que se elevam?',options:['Catedral Metropolitana de Brasília','Teatro Amazonas','Museu do Ipiranga','Elevador Lacerda'],correct:0,fact:'A Catedral de Brasília é uma obra famosa pela estrutura moderna.'},
  {id:'B06',category:'brasilia',text:'O Palácio do Planalto é associado principalmente a qual função?',options:['Sede de trabalho da Presidência da República','Estação ferroviária','Museu de astronomia','Estádio de futebol'],correct:0,fact:'O Palácio do Planalto é sede de trabalho da Presidência da República.'},
  {id:'B07',category:'brasilia',text:'Brasília fica em qual unidade federativa?',options:['Distrito Federal','Estado do Rio de Janeiro','Estado de São Paulo','Estado do Pará'],correct:0,fact:'A capital brasileira está localizada no Distrito Federal.'},
  {id:'B08',category:'brasilia',text:'Qual presidente esteve à frente da construção e inauguração de Brasília?',options:['Juscelino Kubitschek','Dom Pedro II','Getúlio Vargas em 1930','Deodoro da Fonseca'],correct:0,fact:'Juscelino Kubitschek era presidente durante a construção e inauguração de Brasília.'},
];

export function validateBank(bank = questions) {
  if (bank.length !== 40) throw new Error('Banco deve ter exatamente 40 questões');
  const ids = new Set();
  for (const cat of categories) if (bank.filter(q => q.category === cat.id).length !== 8) throw new Error(`Categoria ${cat.id} deve ter 8 perguntas`);
  for (const q of bank) {
    if (ids.has(q.id)) throw new Error(`ID duplicado: ${q.id}`);
    ids.add(q.id);
    if (!Array.isArray(q.options) || q.options.length !== 4 || !Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3 || !q.text?.trim()) throw new Error(`Pergunta inválida: ${q.id}`);
    if (new Set(q.options).size !== 4) throw new Error(`Opções repetidas em ${q.id}`);
  }
  return true;
}
export function shuffle(input, rng = Math.random) {
  const copy = [...input];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function makeSession(bank = questions, rng = Math.random) {
  const chosen = categories.map(cat => {
    const group = bank.filter(q => q.category === cat.id);
    if (!group.length) throw new Error(`Sem perguntas em ${cat.id}`);
    const q = group[Math.floor(rng() * group.length)];
    return {...q, answers: shuffle(q.options.map((text, original) => ({id:`${q.id}-${original}`,text,correct:original === q.correct})),rng)};
  });
  return shuffle(chosen,rng);
}
validateBank();
