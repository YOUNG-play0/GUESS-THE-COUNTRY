import { Country, Difficulty } from '../types';

export const countries: Country[] = [
  // EASY
  { name: 'France', code: 'FR', flag: '🇫🇷', capital: 'Paris', continent: 'Europe', difficulty: 'easy', hints: ['Famous for the Eiffel Tower', 'Known for wine and cheese', 'Home of the Louvre museum'], monument: 'Eiffel Tower' },
  { name: 'United States', code: 'US', flag: '🇺🇸', capital: 'Washington D.C.', continent: 'North America', difficulty: 'easy', hints: ['50 states', 'Statue of Liberty', 'Hollywood'], monument: 'Statue of Liberty' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', capital: 'Tokyo', continent: 'Asia', difficulty: 'easy', hints: ['Land of the Rising Sun', 'Famous for sushi and anime', 'Mount Fuji'], monument: 'Mount Fuji' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', capital: 'Brasília', continent: 'South America', difficulty: 'easy', hints: ['Largest country in South America', 'Famous for carnival', 'Amazon rainforest'], monument: 'Christ the Redeemer' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', capital: 'London', continent: 'Europe', difficulty: 'easy', hints: ['Big Ben', 'Royal family', 'Tea culture'], monument: 'Big Ben' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹', capital: 'Rome', continent: 'Europe', difficulty: 'easy', hints: ['Boot-shaped country', 'Pizza and pasta', 'Colosseum'], monument: 'Colosseum' },
  { name: 'China', code: 'CN', flag: '🇨🇳', capital: 'Beijing', continent: 'Asia', difficulty: 'easy', hints: ['Great Wall', 'Most populous country', 'Dragon culture'], monument: 'Great Wall of China' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', capital: 'Berlin', continent: 'Europe', difficulty: 'easy', hints: ['Oktoberfest', 'Berlin Wall', 'Known for engineering'], monument: 'Brandenburg Gate' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', capital: 'Ottawa', continent: 'North America', difficulty: 'easy', hints: ['Maple leaf flag', 'Second largest country', 'Known for hockey'], monument: 'CN Tower' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', capital: 'Canberra', continent: 'Oceania', difficulty: 'easy', hints: ['Kangaroos and koalas', 'Island continent', 'Great Barrier Reef'], monument: 'Sydney Opera House' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸', capital: 'Madrid', continent: 'Europe', difficulty: 'easy', hints: ['Flamenco dancing', 'Bullfighting', 'Sagrada Familia'], monument: 'Sagrada Familia' },
  { name: 'India', code: 'IN', flag: '🇮🇳', capital: 'New Delhi', continent: 'Asia', difficulty: 'easy', hints: ['Taj Mahal', 'Bollywood', 'Spicy cuisine'], monument: 'Taj Mahal' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺', capital: 'Moscow', continent: 'Europe', difficulty: 'easy', hints: ['Largest country in the world', 'Kremlin', 'Cold winters'], monument: 'Saint Basil Cathedral' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽', capital: 'Mexico City', continent: 'North America', difficulty: 'easy', hints: ['Tacos and burritos', 'Aztec pyramids', 'Day of the Dead'], monument: 'Chichen Itza' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬', capital: 'Cairo', continent: 'Africa', difficulty: 'easy', hints: ['Pyramids of Giza', 'Nile River', 'Pharaohs'], monument: 'Pyramids of Giza' },

  // MEDIUM
  { name: 'South Korea', code: 'KR', flag: '🇰🇷', capital: 'Seoul', continent: 'Asia', difficulty: 'medium', hints: ['K-pop culture', 'Samsung origin', 'DMZ border'], monument: 'Gyeongbokgung Palace' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷', capital: 'Buenos Aires', continent: 'South America', difficulty: 'medium', hints: ['Tango dance', 'Patagonia', 'Lionel Messi homeland'], monument: 'Obelisco' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷', capital: 'Ankara', continent: 'Europe', difficulty: 'medium', hints: ['Bridges Europe and Asia', 'Hagia Sophia', 'Turkish delight'], monument: 'Hagia Sophia' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭', capital: 'Bangkok', continent: 'Asia', difficulty: 'medium', hints: ['Land of Smiles', 'Buddhist temples', 'Thai cuisine'], monument: 'Wat Arun' },
  { name: 'Sweden', code: 'SE', flag: '🇸🇪', capital: 'Stockholm', continent: 'Europe', difficulty: 'medium', hints: ['IKEA origin', 'Nobel Prize', 'Vikings history'], monument: 'Vasa Museum' },
  { name: 'Portugal', code: 'PT', flag: '🇵🇹', capital: 'Lisbon', continent: 'Europe', difficulty: 'medium', hints: ['Age of Exploration', 'Pastéis de nata', 'Fado music'], monument: 'Belém Tower' },
  { name: 'Poland', code: 'PL', flag: '🇵🇱', capital: 'Warsaw', continent: 'Europe', difficulty: 'medium', hints: ['Pierogi dumplings', 'Chopin homeland', 'Auschwitz memorial'], monument: 'Wawel Castle' },
  { name: 'Norway', code: 'NO', flag: '🇳🇴', capital: 'Oslo', continent: 'Europe', difficulty: 'medium', hints: ['Fjords', 'Northern Lights', 'Viking heritage'], monument: 'Bryggen' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴', capital: 'Bogotá', continent: 'South America', difficulty: 'medium', hints: ['Coffee production', 'Shakira homeland', 'Emeralds'], monument: 'Cartagena Walls' },
  { name: 'Morocco', code: 'MA', flag: '🇲🇦', capital: 'Rabat', continent: 'Africa', difficulty: 'medium', hints: ['Sahara Desert border', 'Marrakech', 'Couscous'], monument: 'Hassan II Mosque' },
  { name: 'Vietnam', code: 'VN', flag: '🇻🇳', capital: 'Hanoi', continent: 'Asia', difficulty: 'medium', hints: ['Pho soup', 'Ha Long Bay', 'Mekong Delta'], monument: 'Ha Long Bay' },
  { name: 'Greece', code: 'GR', flag: '🇬🇷', capital: 'Athens', continent: 'Europe', difficulty: 'medium', hints: ['Ancient Olympics', 'Parthenon', 'Greek mythology'], monument: 'Parthenon' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', capital: 'Pretoria', continent: 'Africa', difficulty: 'medium', hints: ['Rainbow Nation', 'Table Mountain', 'Apartheid history'], monument: 'Table Mountain' },
  { name: 'Peru', code: 'PE', flag: '🇵🇪', capital: 'Lima', continent: 'South America', difficulty: 'medium', hints: ['Machu Picchu', 'Inca civilization', 'Llamas'], monument: 'Machu Picchu' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱', capital: 'Amsterdam', continent: 'Europe', difficulty: 'medium', hints: ['Tulips and windmills', 'Below sea level', 'Van Gogh'], monument: 'Windmills of Kinderdijk' },

  // HARD
  { name: 'Croatia', code: 'HR', flag: '🇭🇷', capital: 'Zagreb', continent: 'Europe', difficulty: 'hard', hints: ['Adriatic coast', 'Game of Thrones filming', 'Checkered flag pattern'], monument: 'Dubrovnik Walls' },
  { name: 'Chile', code: 'CL', flag: '🇨🇱', capital: 'Santiago', continent: 'South America', difficulty: 'hard', hints: ['Longest country north-south', 'Atacama Desert', 'Easter Island'] },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪', capital: 'Nairobi', continent: 'Africa', difficulty: 'hard', hints: ['Safari capital', 'Marathon runners', 'Maasai Mara'] },
  { name: 'Philippines', code: 'PH', flag: '🇵🇭', capital: 'Manila', continent: 'Asia', difficulty: 'hard', hints: ['7000+ islands', 'Chocolate Hills', 'Typhoon corridor'] },
  { name: 'Czech Republic', code: 'CZ', flag: '🇨🇿', capital: 'Prague', continent: 'Europe', difficulty: 'hard', hints: ['Beer capital', 'Prague Castle', 'Bohemia region'] },
  { name: 'Finland', code: 'FI', flag: '🇫🇮', capital: 'Helsinki', continent: 'Europe', difficulty: 'hard', hints: ['Land of thousand lakes', 'Nokia origin', 'Sauna culture'] },
  { name: 'Cuba', code: 'CU', flag: '🇨🇺', capital: 'Havana', continent: 'North America', difficulty: 'hard', hints: ['Classic cars', 'Cigars', 'Caribbean island'] },
  { name: 'Romania', code: 'RO', flag: '🇷🇴', capital: 'Bucharest', continent: 'Europe', difficulty: 'hard', hints: ['Dracula legend', 'Carpathian Mountains', 'Transylvania'] },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾', capital: 'Kuala Lumpur', continent: 'Asia', difficulty: 'hard', hints: ['Petronas Towers', 'Tropical rainforests', 'Multi-ethnic society'] },
  { name: 'Ireland', code: 'IE', flag: '🇮🇪', capital: 'Dublin', continent: 'Europe', difficulty: 'hard', hints: ['Emerald Isle', 'Guinness beer', 'St Patrick Day'] },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', capital: 'Wellington', continent: 'Oceania', difficulty: 'hard', hints: ['Lord of the Rings filming', 'Kiwi bird', 'All Blacks rugby'] },
  { name: 'Ukraine', code: 'UA', flag: '🇺🇦', capital: 'Kyiv', continent: 'Europe', difficulty: 'hard', hints: ['Chernobyl', 'Breadbasket of Europe', 'Sunflower fields'] },
  { name: 'Ethiopia', code: 'ET', flag: '🇪🇹', capital: 'Addis Ababa', continent: 'Africa', difficulty: 'hard', hints: ['Coffee origin', 'Lucy fossil', 'Never colonized'] },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰', capital: 'Islamabad', continent: 'Asia', difficulty: 'hard', hints: ['K2 mountain', 'Indus Valley', 'Cricket passion'] },
  { name: 'Iceland', code: 'IS', flag: '🇮🇸', capital: 'Reykjavik', continent: 'Europe', difficulty: 'hard', hints: ['Land of fire and ice', 'Geysers', 'Northern Lights'] },

  // EXPERT
  { name: 'Bhutan', code: 'BT', flag: '🇧🇹', capital: 'Thimphu', continent: 'Asia', difficulty: 'expert', hints: ['Gross National Happiness', 'Dragon Kingdom', 'Carbon negative country'] },
  { name: 'Liechtenstein', code: 'LI', flag: '🇱🇮', capital: 'Vaduz', continent: 'Europe', difficulty: 'expert', hints: ['Doubly landlocked', 'Alpine microstate', 'Between Switzerland and Austria'] },
  { name: 'Madagascar', code: 'MG', flag: '🇲🇬', capital: 'Antananarivo', continent: 'Africa', difficulty: 'expert', hints: ['Lemurs', 'Fourth largest island', 'Baobab trees'] },
  { name: 'Uzbekistan', code: 'UZ', flag: '🇺🇿', capital: 'Tashkent', continent: 'Asia', difficulty: 'expert', hints: ['Silk Road', 'Doubly landlocked', 'Samarkand city'] },
  { name: 'Montenegro', code: 'ME', flag: '🇲🇪', capital: 'Podgorica', continent: 'Europe', difficulty: 'expert', hints: ['Adriatic coastline', 'Name means Black Mountain', 'Former Yugoslavia'] },
  { name: 'Laos', code: 'LA', flag: '🇱🇦', capital: 'Vientiane', continent: 'Asia', difficulty: 'expert', hints: ['Landlocked in SE Asia', 'Mekong River', 'Buddhist monasteries'] },
  { name: 'Suriname', code: 'SR', flag: '🇸🇷', capital: 'Paramaribo', continent: 'South America', difficulty: 'expert', hints: ['Smallest country in S. America', 'Dutch-speaking', 'Dense rainforest'] },
  { name: 'Lesotho', code: 'LS', flag: '🇱🇸', capital: 'Maseru', continent: 'Africa', difficulty: 'expert', hints: ['Entirely surrounded by South Africa', 'Kingdom in the Sky', 'Highest low point of any country'] },
  { name: 'Brunei', code: 'BN', flag: '🇧🇳', capital: 'Bandar Seri Begawan', continent: 'Asia', difficulty: 'expert', hints: ['Oil-rich sultanate', 'On Borneo island', 'No income tax'] },
  { name: 'Togo', code: 'TG', flag: '🇹🇬', capital: 'Lomé', continent: 'Africa', difficulty: 'expert', hints: ['Narrow strip in West Africa', 'Voodoo culture', 'Between Ghana and Benin'] },
  { name: 'Moldova', code: 'MD', flag: '🇲🇩', capital: 'Chișinău', continent: 'Europe', difficulty: 'expert', hints: ['Wine country', 'Between Romania and Ukraine', 'Former Soviet republic'] },
  { name: 'Fiji', code: 'FJ', flag: '🇫🇯', capital: 'Suva', continent: 'Oceania', difficulty: 'expert', hints: ['333 islands', 'South Pacific paradise', 'Rugby sevens champions'] },
  { name: 'Eritrea', code: 'ER', flag: '🇪🇷', capital: 'Asmara', continent: 'Africa', difficulty: 'expert', hints: ['Red Sea coast', 'Art Deco architecture', 'Horn of Africa'] },
  { name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬', capital: 'Bishkek', continent: 'Asia', difficulty: 'expert', hints: ['Yurt culture', 'Tian Shan mountains', 'Central Asian republic'] },
  { name: 'Comoros', code: 'KM', flag: '🇰🇲', capital: 'Moroni', continent: 'Africa', difficulty: 'expert', hints: ['Volcanic islands', 'Indian Ocean', 'Between Madagascar and Mozambique'] },
];

export function getCountriesByDifficulty(difficulty: Difficulty): Country[] {
  return countries.filter(c => c.difficulty === difficulty);
}

export function getRandomCountries(count: number, difficulty?: Difficulty, exclude?: string[]): Country[] {
  let pool = difficulty ? countries.filter(c => c.difficulty === difficulty) : [...countries];
  if (exclude) {
    pool = pool.filter(c => !exclude.includes(c.name));
  }
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
