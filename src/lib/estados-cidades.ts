export interface Estado {
  sigla: string;
  nome: string;
  cidades: string[];
}

export const estados: Estado[] = [
  {
    sigla: 'AC',
    nome: 'Acre',
    cidades: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá', 'Feijó', 'Brasiléia', 'Senador Guiomard', 'Plácido de Castro', 'Xapuri', 'Mâncio Lima']
  },
  {
    sigla: 'AL',
    nome: 'Alagoas',
    cidades: ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Penedo', 'União dos Palmares', 'Rio Largo', 'Pilar', 'São Miguel dos Campos', 'Coruripe', 'Campo Alegre']
  },
  {
    sigla: 'AP',
    nome: 'Amapá',
    cidades: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Mazagão', 'Tartarugalzinho', 'Pedra Branca do Amapari', 'Calçoene', 'Amapá', 'Vitória do Jari']
  },
  {
    sigla: 'AM',
    nome: 'Amazonas',
    cidades: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari', 'Tefé', 'Maués', 'Iranduba', 'Lábrea', 'Tabatinga']
  },
  {
    sigla: 'BA',
    nome: 'Bahia',
    cidades: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna', 'Juazeiro', 'Lauro de Freitas', 'Ilhéus', 'Jequié', 'Barreiras']
  },
  {
    sigla: 'CE',
    nome: 'Ceará',
    cidades: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá']
  },
  {
    sigla: 'DF',
    nome: 'Distrito Federal',
    cidades: ['Brasília', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Plano Piloto', 'Santa Maria', 'São Sebastião', 'Recanto das Emas', 'Gama', 'Guará']
  },
  {
    sigla: 'ES',
    nome: 'Espírito Santo',
    cidades: ['Vitória', 'Vila Velha', 'Serra', 'Linhares', 'Cariacica', 'São Mateus', 'Colatina', 'Guarapari', 'Aracruz', 'Viana']
  },
  {
    sigla: 'GO',
    nome: 'Goiás',
    cidades: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Águas Lindas de Goiás', 'Valparaíso de Goiás', 'Trindade', 'Formosa', 'Novo Gama']
  },
  {
    sigla: 'MA',
    nome: 'Maranhão',
    cidades: ['São Luís', 'Imperatriz', 'Timon', 'Codó', 'Caxias', 'Paço do Lumiar', 'Açailândia', 'Bacabal', 'Balsas', 'Barra do Corda']
  },
  {
    sigla: 'MT',
    nome: 'Mato Grosso',
    cidades: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra', 'Cáceres', 'Sorriso', 'Lucas do Rio Verde', 'Primavera do Leste', 'Barra do Garças']
  },
  {
    sigla: 'MS',
    nome: 'Mato Grosso do Sul',
    cidades: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã', 'Naviraí', 'Aquidauana', 'Nova Andradina', 'Sidrolândia', 'Paranaíba']
  },
  {
    sigla: 'MG',
    nome: 'Minas Gerais',
    cidades: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Ribeirão das Neves', 'Uberaba', 'Governador Valadares', 'Ipatinga']
  },
  {
    sigla: 'PA',
    nome: 'Pará',
    cidades: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Castanhal', 'Parauapebas', 'Abaetetuba', 'Cametá', 'Marituba', 'Barcarena']
  },
  {
    sigla: 'PB',
    nome: 'Paraíba',
    cidades: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Sousa', 'Cajazeiras', 'Cabedelo', 'Guarabira', 'Pombal']
  },
  {
    sigla: 'PR',
    nome: 'Paraná',
    cidades: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu', 'Colombo', 'Guarapuava', 'Paranaguá']
  },
  {
    sigla: 'PE',
    nome: 'Pernambuco',
    cidades: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista', 'Cabo de Santo Agostinho', 'Camaragibe', 'Garanhuns', 'Vitória de Santo Antão']
  },
  {
    sigla: 'PI',
    nome: 'Piauí',
    cidades: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano', 'Picos', 'Parnaíba', 'Piripiri', 'Floriano', 'Barras']
  },
  {
    sigla: 'RJ',
    nome: 'Rio de Janeiro',
    cidades: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo', 'São João de Meriti', 'Petrópolis', 'Campos dos Goytacazes', 'Volta Redonda']
  },
  {
    sigla: 'RN',
    nome: 'Rio Grande do Norte',
    cidades: ['Natal', 'Mossoró', 'Parnamirim', 'Ceará-Mirim', 'São Gonçalo do Amarante', 'Canguaretama', 'Currais Novos', 'Santa Cruz', 'Caicó', 'Apodi']
  },
  {
    sigla: 'RS',
    nome: 'Rio Grande do Sul',
    cidades: [
      'Aceguá', 'Agudo', 'Ajuricaba', 'Alecrim', 'Alegrete', 'Alegria', 'Almirante Tamandaré do Sul', 'Alpestre', 'Alto Alegre', 'Alto Feliz', 'Alvorada', 'Amaral Ferrador', 'Ametista do Sul', 'André da Rocha', 'Anta Gorda', 'Antônio Prado', 'Aratiba', 'Arroio do Meio', 'Arroio do Sal', 'Arroio do Tigre', 'Arroio dos Ratos', 'Arroio Grande', 'Arvorezinha', 'Augusto Pestana', 'Áurea', 'Bagé', 'Balneário Pinhal', 'Barão', 'Barão de Cotegipe', 'Barão do Triunfo', 'Barra do Guarita', 'Barra do Quaraí', 'Barra do Ribeiro', 'Barra do Rio Azul', 'Barra Funda', 'Barracão', 'Barros Cassal', 'Benjamin Constant do Sul', 'Bento Gonçalves', 'Boa Vista das Missões', 'Boa Vista do Buricá', 'Boa Vista do Cadeado', 'Boa Vista do Incra', 'Boa Vista do Sul', 'Bom Jesus', 'Bom Princípio', 'Bom Progresso', 'Bom Retiro do Sul', 'Boqueirão do Leão', 'Bossoroca', 'Bozano', 'Braga', 'Brochier', 'Butiá', 'Caçapava do Sul', 'Cacequi', 'Cachoeira do Sul', 'Cachoeirinha', 'Cacique Doble', 'Caibaté', 'Caiçara', 'Camaquã', 'Camargo', 'Cambará do Sul', 'Campestre da Serra', 'Campina das Missões', 'Campinas do Sul', 'Campo Bom', 'Campo Novo', 'Campos Borges', 'Candelária', 'Cândido Godói', 'Candiota', 'Canela', 'Canguçu', 'Canoas', 'Canudos do Vale', 'Capão Bonito do Sul', 'Capão da Canoa', 'Capão do Cipó', 'Capão do Leão', 'Capela de Santana', 'Capitão', 'Capivari do Sul', 'Caraá', 'Carazinho', 'Carlos Barbosa', 'Carlos Gomes', 'Casca', 'Caseiros', 'Catuípe', 'Caxias do Sul', 'Cazuza Ferreira', 'Centenário', 'Cerrito', 'Cerro Branco', 'Cerro Grande', 'Cerro Grande do Sul', 'Cerro Largo', 'Chapada', 'Charqueadas', 'Charrua', 'Chiapetta', 'Chuí', 'Chuvisca', 'Cidreira', 'Ciríaco', 'Colinas', 'Colorado', 'Condor', 'Constantina', 'Coqueiro Baixo', 'Coqueiros do Sul', 'Coronel Barros', 'Coronel Bicaco', 'Coronel Pilar', 'Cotiporã', 'Coxilha', 'Crissiumal', 'Cristal', 'Cristal do Sul', 'Cruz Alta', 'Cruzaltense', 'Cruzeiro do Sul', 'David Canabarro', 'Derrubadas', 'Dezesseis de Novembro', 'Dilermando de Aguiar', 'Dois Irmãos', 'Dois Irmãos das Missões', 'Dois Lajeados', 'Dom Feliciano', 'Dom Pedrito', 'Dom Pedro de Alcântara', 'Dona Francisca', 'Doutor Maurício Cardoso', 'Doutor Ricardo', 'Eldorado do Sul', 'Encantado', 'Encruzilhada do Sul', 'Engenho Velho', 'Entre Rios do Sul', 'Entre-Ijuís', 'Erebango', 'Erechim', 'Ernestina', 'Erval Grande', 'Erval Seco', 'Esmeralda', 'Esperança do Sul', 'Espumoso', 'Estação', 'Estância Velha', 'Esteio', 'Estrela', 'Estrela Velha', 'Eugênio de Castro', 'Fagundes Varela', 'Farroupilha', 'Faxinal do Soturno', 'Faxinalzinho', 'Fazenda Vilanova', 'Feliz', 'Flores da Cunha', 'Floriano Peixoto', 'Fontoura Xavier', 'Formigueiro', 'Forquetinha', 'Fortaleza dos Valos', 'Frederico Westphalen', 'Garibaldi', 'Garruchos', 'Gaurama', 'General Câmara', 'Gentil', 'Getúlio Vargas', 'Giruá', 'Glorinha', 'Gramado', 'Gramado dos Loureiros', 'Gramado Xavier', 'Gravataí', 'Guabiju', 'Guaíba', 'Guaporé', 'Guarani das Missões', 'Harmonia', 'Herval', 'Herveiras', 'Horizontina', 'Hulha Negra', 'Humaitá', 'Ibarama', 'Ibiaçá', 'Ibiraiaras', 'Ibirapuitã', 'Ibirubá', 'Igrejinha', 'Ijuí', 'Ilópolis', 'Imbé', 'Imigrante', 'Independência', 'Inhacorá', 'Ipê', 'Ipiranga do Sul', 'Iraí', 'Itaara', 'Itacurubi', 'Itapuca', 'Itaqui', 'Itati', 'Itatiba do Sul', 'Ivorá', 'Ivoti', 'Jaboticaba', 'Jacuizinho', 'Jacutinga', 'Jaguarão', 'Jaguari', 'Jaquirana', 'Jari', 'Jóia', 'Júlio de Castilhos', 'Lagoa Bonita do Sul', 'Lagoa dos Três Cantos', 'Lagoa Vermelha', 'Lagoão', 'Lajeado', 'Lajeado do Bugre', 'Lavras do Sul', 'Liberato Salzano', 'Lindolfo Collor', 'Linha Nova', 'Machadinho', 'Maçambará', 'Mampituba', 'Manoel Viana', 'Maquiné', 'Maratá', 'Marau', 'Marcelino Ramos', 'Mariana Pimentel', 'Mariano Moro', 'Marques de Souza', 'Mata', 'Mato Castelhano', 'Mato Leitão', 'Mato Queimado', 'Maximiliano de Almeida', 'Minas do Leão', 'Miraguaí', 'Montauri', 'Monte Alegre dos Campos', 'Monte Belo do Sul', 'Montenegro', 'Mormaço', 'Morrinhos do Sul', 'Morro Redondo', 'Morro Reuter', 'Mostardas', 'Muçum', 'Muitos Capões', 'Muliterno', 'Não-Me-Toque', 'Nicolau Vergueiro', 'Nonoai', 'Nova Alvorada', 'Nova Araçá', 'Nova Bassano', 'Nova Boa Vista', 'Nova Bréscia', 'Nova Candelária', 'Nova Esperança do Sul', 'Nova Hartz', 'Nova Pádua', 'Nova Palma', 'Nova Petrópolis', 'Nova Prata', 'Nova Ramada', 'Nova Roma do Sul', 'Nova Santa Rita', 'Novo Barreiro', 'Novo Cabrais', 'Novo Hamburgo', 'Novo Machado', 'Novo Tiradentes', 'Novo Xingu', 'Osório', 'Paim Filho', 'Palmares do Sul', 'Palmeira das Missões', 'Palmitinho', 'Panambi', 'Pantano Grande', 'Paraí', 'Paraíso do Sul', 'Pareci Novo', 'Parobé', 'Passa Sete', 'Passo do Sobrado', 'Passo Fundo', 'Paulo Bento', 'Paverama', 'Pedras Altas', 'Pedro Osório', 'Pejuçara', 'Pelotas', 'Picada Café', 'Pinhal', 'Pinhal da Serra', 'Pinhal Grande', 'Pinheirinho do Vale', 'Pinheiro Machado', 'Pirapó', 'Piratini', 'Planalto', 'Poço das Antas', 'Pontão', 'Ponte Preta', 'Portão', 'Porto Alegre', 'Porto Lucena', 'Porto Mauá', 'Porto Vera Cruz', 'Porto Xavier', 'Pouso Novo', 'Presidente Lucena', 'Progresso', 'Protásio Alves', 'Putinga', 'Quaraí', 'Quatro Irmãos', 'Quevedos', 'Quinze de Novembro', 'Redentora', 'Relvado', 'Restinga Seca', 'Rio dos Índios', 'Rio Grande', 'Rio Pardo', 'Riozinho', 'Roca Sales', 'Rodeio Bonito', 'Rolador', 'Rolante', 'Ronda Alta', 'Rondinha', 'Roque Gonzales', 'Rosário do Sul', 'Sagrada Família', 'Saldanha Marinho', 'Salto do Jacuí', 'Salvador das Missões', 'Salvador do Sul', 'Sananduva', 'Santa Bárbara do Sul', 'Santa Cecília do Sul', 'Santa Clara do Sul', 'Santa Cruz do Sul', 'Santa Margarida do Sul', 'Santa Maria', 'Santa Maria do Herval', 'Santa Rosa', 'Santa Tereza', 'Santa Vitória do Palmar', 'Santana da Boa Vista', 'Santana do Livramento', 'Santiago', 'Santo Ângelo', 'Santo Antônio da Patrulha', 'Santo Antônio das Missões', 'Santo Antônio do Palma', 'Santo Antônio do Planalto', 'Santo Augusto', 'Santo Cristo', 'Santo Expedito do Sul', 'São Borja', 'São Domingos do Sul', 'São Francisco de Assis', 'São Francisco de Paula', 'São Gabriel', 'São Jerônimo', 'São João da Urtiga', 'São João do Polêsine', 'São Jorge', 'São José das Missões', 'São José do Herval', 'São José do Hortêncio', 'São José do Inhacorá', 'São José do Norte', 'São José do Ouro', 'São José do Sul', 'São José dos Ausentes', 'São Leopoldo', 'São Lourenço do Sul', 'São Luiz Gonzaga', 'São Marcos', 'São Martinho', 'São Martinho da Serra', 'São Miguel das Missões', 'São Nicolau', 'São Paulo das Missões', 'São Pedro da Serra', 'São Pedro das Missões', 'São Pedro do Butiá', 'São Pedro do Sul', 'São Sebastião do Caí', 'São Sepé', 'São Valentim', 'São Valentim do Sul', 'São Valério do Sul', 'São Vendelino', 'São Vicente do Sul', 'Sapiranga', 'Sapucaia do Sul', 'Sarandi', 'Seberi', 'Sede Nova', 'Segredo', 'Selbach', 'Senador Salgado Filho', 'Sentinela do Sul', 'Serafina Corrêa', 'Sério', 'Sertão', 'Sertão Santana', 'Sete de Setembro', 'Severiano de Almeida', 'Silveira Martins', 'Sinimbu', 'Sobradinho', 'Soledade', 'Tabaí', 'Tapejara', 'Tapera', 'Tapes', 'Taquara', 'Taquari', 'Taquaruçu do Sul', 'Tavares', 'Tenente Portela', 'Terra de Areia', 'Teutônia', 'Tio Hugo', 'Tiradentes do Sul', 'Toropi', 'Torres', 'Tramandaí', 'Travesseiro', 'Três Arroios', 'Três Cachoeiras', 'Três Coroas', 'Três de Maio', 'Três Forquilhas', 'Três Palmeiras', 'Três Passos', 'Trindade do Sul', 'Triunfo', 'Tucunduva', 'Tunas', 'Tupanci do Sul', 'Tupanciretã', 'Tupandi', 'Tuparendi', 'Turuçu', 'Ubiretama', 'União da Serra', 'Unistalda', 'Uruguaiana', 'Vacaria', 'Vale do Sol', 'Vale Real', 'Vale Verde', 'Vanini', 'Venâncio Aires', 'Vera Cruz', 'Veranópolis', 'Vespasiano Corrêa', 'Viadutos', 'Viamão', 'Vicente Dutra', 'Victor Graeff', 'Vila Flores', 'Vila Lângaro', 'Vila Maria', 'Vila Nova do Sul', 'Vista Alegre', 'Vista Alegre do Prata', 'Vista Gaúcha', 'Vitória das Missões', 'Westfália', 'Xangri-lá'
    ]
  },
  {
    sigla: 'RO',
    nome: 'Rondônia',
    cidades: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal', 'Pimenta Bueno', 'Guajará-Mirim', 'Jaru', 'Ouro Preto do Oeste', 'Rolim de Moura']
  },
  {
    sigla: 'RR',
    nome: 'Roraima',
    cidades: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Alto Alegre', 'Mucajaí', 'Cantá', 'Bonfim', 'Amajari', 'Pacaraima', 'Iracema']
  },
  {
    sigla: 'SC',
    nome: 'Santa Catarina',
    cidades: ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma', 'Itajaí', 'Lages', 'Jaraguá do Sul', 'Palhoça', 'Brusque']
  },
  {
    sigla: 'SP',
    nome: 'São Paulo',
    cidades: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco', 'Ribeirão Preto', 'Sorocaba', 'Mauá', 'Santos']
  },
  {
    sigla: 'SE',
    nome: 'Sergipe',
    cidades: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'São Cristóvão', 'Tobias Barreto', 'Estância', 'Itabaianinha', 'Poço Redondo', 'Capela']
  },
  {
    sigla: 'TO',
    nome: 'Tocantins',
    cidades: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins', 'Colinas do Tocantins', 'Miracema do Tocantins', 'Dianópolis', 'Augustinópolis', 'Taguatinga']
  }
];

export const getEstados = () => estados;

export const getCidadesByEstado = (estadoSigla: string) => {
  const estado = estados.find(e => e.sigla === estadoSigla);
  return estado ? estado.cidades : [];
};

export const getEstadoBySigla = (sigla: string) => {
  return estados.find(e => e.sigla === sigla);
}; 