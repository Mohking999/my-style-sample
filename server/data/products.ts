export interface ProductSeedData {
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn: string;
  priceDzd: number;
  originalPriceDzd?: number;
  categorySlug: string;
  type: 'ready_to_wear' | 'made_to_order';
  originRegion?: string;
  leadTimeDays?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  images: string[];
  variants: {
    colorNameFr: string;
    colorNameAr: string;
    colorNameEn: string;
    colorHex: string;
    size: string;
    stock: number;
    sku: string;
  }[];
}

export const PRODUCTS_SEED: ProductSeedData[] = [
  // 1. Traditional - Karakou
  {
    slug: 'karakou-algerois-royal-majboud',
    nameFr: 'Karakou Algérois Royal en Velours & Majboud',
    nameAr: 'كراكو عاصمي ملكي من المخمل والمجبود المذهب',
    nameEn: 'Royal Algiers Karakou in Velvet & Majboud Gold Embroidery',
    descriptionFr: 'Veste cintrée en velours de Gênes pourpre brodée artisanalement au fil d’or Majboud selon la tradition algéroise séculaire. Pièce d’exception pour mariages et cérémonies d’honneur.',
    descriptionAr: 'سترة مخملية فاخرة مطرزة يدوياً بخيوط المجبود الذهبية الأصيلة وفق تقاليد القصبة العاصمية العريقة. تحفة للمناسبات والأعراس الفاخرة.',
    descriptionEn: 'Fitted velvet jacket meticulously hand-embroidered with authentic golden Majboud threads following centuries of Algiers Casbah couture tradition.',
    priceDzd: 48000,
    originalPriceDzd: 55000,
    categorySlug: 'traditional',
    type: 'made_to_order',
    originRegion: 'Alger (La Casbah)',
    leadTimeDays: 18,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=900',
    ],
    variants: [
      { colorNameFr: 'Bordeaux Impérial', colorNameAr: 'عنابي ملكي', colorNameEn: 'Imperial Burgundy', colorHex: '#581825', size: '38', stock: 3, sku: 'KAR-AL-BUR-38' },
      { colorNameFr: 'Bordeaux Impérial', colorNameAr: 'عنابي ملكي', colorNameEn: 'Imperial Burgundy', colorHex: '#581825', size: '40', stock: 4, sku: 'KAR-AL-BUR-40' },
      { colorNameFr: 'Bordeaux Impérial', colorNameAr: 'عنابي ملكي', colorNameEn: 'Imperial Burgundy', colorHex: '#581825', size: '42', stock: 2, sku: 'KAR-AL-BUR-42' },
      { colorNameFr: 'Vert Forêt Royal', colorNameAr: 'أخضر ملكي', colorNameEn: 'Royal Forest Green', colorHex: '#163323', size: '38', stock: 2, sku: 'KAR-AL-GRN-38' },
      { colorNameFr: 'Vert Forêt Royal', colorNameAr: 'أخضر ملكي', colorNameEn: 'Royal Forest Green', colorHex: '#163323', size: '40', stock: 3, sku: 'KAR-AL-GRN-40' },
    ],
  },

  // 2. Traditional - Chedda Tlemcenia
  {
    slug: 'chedda-tlemcenia-imperiale',
    nameFr: 'Chedda Tlemcenia Impériale Haute Couture',
    nameAr: 'شدة تلمسانية ملكية فاخرة',
    nameEn: 'Imperial Tlemcen Chedda Haute Couture',
    descriptionFr: 'Ensemble nuptial traditionnel inscrit au patrimoine mondial. Kaftan en velours brodé Fetla et Majboud, plastron de perles et finitions orfèvres réalisées par les maîtres artisans de Tlemcen.',
    descriptionAr: 'لباس العروس التلمساني المصنف كتراث عالمي إنساني. قفطان مخملي مطرز بالفتلة والمجبود مع صدرية مرصعة بالخرز واللؤلؤ.',
    descriptionEn: 'The iconic bridal ensemble registered as UNESCO World Heritage. Velvet caftan hand-embroidered with gold cord and freshwater pearls.',
    priceDzd: 75000,
    categorySlug: 'traditional',
    type: 'made_to_order',
    originRegion: 'Tlemcen',
    leadTimeDays: 25,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900',
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=900',
    ],
    variants: [
      { colorNameFr: 'Or & Rubis', colorNameAr: 'ذهبي وياقوتي', colorNameEn: 'Gold & Ruby', colorHex: '#C5A059', size: 'Standard', stock: 5, sku: 'CHD-TLM-GLD-STD' },
      { colorNameFr: 'Or & Émeraude', colorNameAr: 'ذهبي وزمردي', colorNameEn: 'Gold & Emerald', colorHex: '#1B4D3E', size: 'Standard', stock: 3, sku: 'CHD-TLM-EMR-STD' },
    ],
  },

  // 3. Traditional - Blouza Oranaise
  {
    slug: 'blouza-oranaise-dentelle-cristaux',
    nameFr: 'Blouza Oranaise en Dentelle Perle & Soie',
    nameAr: 'بلوزة وهرانية بالدانتيل واللؤلؤ الحريري',
    nameEn: 'Oran Blouza in Beaded Lace & Silk',
    descriptionFr: 'Robe traditionnelle oranaise moderne en crêpe fluide avec bustier richement orné de perles fines et cristaux taillés. Fente discrète pour une démarche élégante.',
    descriptionAr: 'فستان البلوزة الوهرانية الأنيقة بقماش الكريب الانسيابي مع صدرية مطرزة باللؤلؤ والكريستال اللامع.',
    descriptionEn: 'Contemporary Oranese Blouza dress in fluid silk-crepe with exquisitely beaded lace neckline and waist accentuation.',
    priceDzd: 26000,
    originalPriceDzd: 29500,
    categorySlug: 'traditional',
    type: 'ready_to_wear',
    originRegion: 'Oran',
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900',
    ],
    variants: [
      { colorNameFr: 'Bleu Royal', colorNameAr: 'أزرق ملكي', colorNameEn: 'Royal Blue', colorHex: '#1D4ED8', size: '38', stock: 4, sku: 'BLZ-ORN-BLU-38' },
      { colorNameFr: 'Bleu Royal', colorNameAr: 'أزرق ملكي', colorNameEn: 'Royal Blue', colorHex: '#1D4ED8', size: '40', stock: 3, sku: 'BLZ-ORN-BLU-40' },
      { colorNameFr: 'Bleu Royal', colorNameAr: 'أزرق ملكي', colorNameEn: 'Royal Blue', colorHex: '#1D4ED8', size: '42', stock: 2, sku: 'BLZ-ORN-BLU-42' },
      { colorNameFr: 'Rose Poudré', colorNameAr: 'وردي ناعم', colorNameEn: 'Dusty Rose', colorHex: '#E0B0B6', size: '38', stock: 5, sku: 'BLZ-ORN-RS-38' },
      { colorNameFr: 'Rose Poudré', colorNameAr: 'وردي ناعم', colorNameEn: 'Dusty Rose', colorHex: '#E0B0B6', size: '40', stock: 2, sku: 'BLZ-ORN-RS-40' },
    ],
  },

  // 4. Traditional - Gandoura Constantinoise
  {
    slug: 'gandoura-constantinoise-fetla',
    nameFr: 'Gandoura Constantinoise en Velours & Broderie Fetla',
    nameAr: 'قندورة قسنطينية بالقطيفة وتطريز الفتلة',
    nameEn: 'Constantine Velvet Gandoura with Fetla Embroidery',
    descriptionFr: 'Gandoura impériale de Constantine en velours lourd grenat brodée à la main au fil d’or selon le motif paon et fleur de jasmin.',
    descriptionAr: 'قندورة قسنطينية فخمة بالقطيفة الحرة وتطريز الفتلة الذهبية على الصدر والأكمام بنقوش تقليدية عريقة.',
    descriptionEn: 'Aristocratic Constantine velvet gandoura featuring dense golden Fetla hand-embroidery along neckline, chest, and hem.',
    priceDzd: 42000,
    categorySlug: 'traditional',
    type: 'made_to_order',
    originRegion: 'Constantine',
    leadTimeDays: 20,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900',
    ],
    variants: [
      { colorNameFr: 'Grenat Velours', colorNameAr: 'عنابي مخملي', colorNameEn: 'Garnet Velvet', colorHex: '#4A0E17', size: '38', stock: 2, sku: 'GND-CST-GRN-38' },
      { colorNameFr: 'Grenat Velours', colorNameAr: 'عنابي مخملي', colorNameEn: 'Garnet Velvet', colorHex: '#4A0E17', size: '40', stock: 3, sku: 'GND-CST-GRN-40' },
      { colorNameFr: 'Noir Profond', colorNameAr: 'أسود داكن', colorNameEn: 'Deep Black', colorHex: '#111111', size: '40', stock: 4, sku: 'GND-CST-BLK-40' },
    ],
  },

  // 5. Traditional - Jebba Kabyle
  {
    slug: 'jebba-kabyle-moderne-soie',
    nameFr: 'Robe Kabyle Moderne en Soie & Passementerie',
    nameAr: 'فستان قبائلي عصري بالحرير والتطريز الأمازيغي',
    nameEn: 'Modern Kabyle Dress in Silk & Geometric Trimmings',
    descriptionFr: 'Réinterprétation moderne de la Thaqendourth kabyle. Lignes épurées, rubans de zigzags traditionnels colorés et ceinture Fouta soyeuse assortie.',
    descriptionAr: 'جبة قبائلية عصرية بتطريزات ألوان الهقار وجرجرة الزاهية مع حزام الفوطة التقليدي منسوج بحرفية عالية.',
    descriptionEn: 'Contemporary reimagining of the Kabyle dress with silk base, vivid traditional zigzag lacework, and matching artisanal woven Fouta belt.',
    priceDzd: 18500,
    categorySlug: 'traditional',
    type: 'ready_to_wear',
    originRegion: 'Kabylie (Tizi Ouzou)',
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900',
    ],
    variants: [
      { colorNameFr: 'Blanc Casbah', colorNameAr: 'أبيض قصبة', colorNameEn: 'Casbah White', colorHex: '#FAF9F6', size: '38', stock: 6, sku: 'JBB-KAB-WHT-38' },
      { colorNameFr: 'Blanc Casbah', colorNameAr: 'أبيض قصبة', colorNameEn: 'Casbah White', colorHex: '#FAF9F6', size: '40', stock: 8, sku: 'JBB-KAB-WHT-40' },
      { colorNameFr: 'Blanc Casbah', colorNameAr: 'أبيض قصبة', colorNameEn: 'Casbah White', colorHex: '#FAF9F6', size: '42', stock: 4, sku: 'JBB-KAB-WHT-42' },
      { colorNameFr: 'Jaune Safran', colorNameAr: 'أصفر زعفراني', colorNameEn: 'Saffron Yellow', colorHex: '#E5A93B', size: '38', stock: 3, sku: 'JBB-KAB-YEL-38' },
    ],
  },

  // 6. Traditional - Burnous Homme
  {
    slug: 'burnous-royal-laine-chaoui',
    nameFr: 'Burnous Royal Homme en Pure Laine & Poil de Chameau',
    nameAr: 'برنوس رجالي ملكي من الصوف الخالص ووبر الإبل',
    nameEn: 'Royal Mens Burnous in Pure Wool & Camel Hair',
    descriptionFr: 'Cape traditionnelle masculine emblématique d’Algérie. Tissé à la main dans les Aurès avec une laine vierge ultra-douce, capuchon travaillé et cordons torsadés.',
    descriptionAr: 'برنوس شتوي رجالي أصيل منسوج يدوياً في الأوراس من صوف نقي ووبر الجمل مع قبعة مطرزة وأشرطة قطنية تقليدية.',
    descriptionEn: 'Iconic Algerian heritage cape hand-loomed in the Aurès mountains using virgin wool and camel hair. Features artisanal cord fastenings.',
    priceDzd: 36000,
    categorySlug: 'men',
    type: 'ready_to_wear',
    originRegion: 'Aurès / Batna',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900',
    ],
    variants: [
      { colorNameFr: 'Brun Chameau', colorNameAr: 'بني وبري', colorNameEn: 'Camel Brown', colorHex: '#A06B43', size: 'L', stock: 5, sku: 'BRN-MEN-CAM-L' },
      { colorNameFr: 'Brun Chameau', colorNameAr: 'بني وبري', colorNameEn: 'Camel Brown', colorHex: '#A06B43', size: 'XL', stock: 4, sku: 'BRN-MEN-CAM-XL' },
      { colorNameFr: 'Blanc Écru', colorNameAr: 'أبيض عاجي', colorNameEn: 'Natural Ecru', colorHex: '#F5F5EC', size: 'L', stock: 6, sku: 'BRN-MEN-WHT-L' },
      { colorNameFr: 'Blanc Écru', colorNameAr: 'أبيض عاجي', colorNameEn: 'Natural Ecru', colorHex: '#F5F5EC', size: 'XL', stock: 3, sku: 'BRN-MEN-WHT-XL' },
    ],
  },

  // 7. Traditional - Burnous Mariée Femme
  {
    slug: 'burnous-mariee-ivoire-brode',
    nameFr: 'Burnous de Mariée Blanc Ivoire en Cachemire Brodé',
    nameAr: 'برنوس عروس أبيض عاجي بالكشمير والتطريز الذهبي',
    nameEn: 'Bridal Ivory Burnous in Embroidered Cashmere',
    descriptionFr: 'Cape de mariée solennelle en cachemire ivoire bordée d’une passementerie en fil d’or fin. Se porte élégamment sur le Karakou ou la robe blanche pour la sortie de noces.',
    descriptionAr: 'برنوس العروسة الأبيض المطرز بالخيوط الذهبية الناعمة. لمسة الحشمة والأناقة المطلقة لخروج العروس في ليلة العمر.',
    descriptionEn: 'Regal bridal cape in soft ivory cashmere bordered with fine golden passementerie, designed to drape gracefully over bridal ensembles.',
    priceDzd: 29000,
    categorySlug: 'wedding',
    type: 'made_to_order',
    originRegion: 'Alger',
    leadTimeDays: 14,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=900',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900',
    ],
    variants: [
      { colorNameFr: 'Blanc Ivoire', colorNameAr: 'أبيض عاجي', colorNameEn: 'Ivory White', colorHex: '#FAF0E6', size: 'Standard', stock: 6, sku: 'BRN-FEM-IVR-STD' },
    ],
  },

  // 8. Traditional - Gandoura Homme Été
  {
    slug: 'gandoura-homme-ete-lin-ghardaia',
    nameFr: 'Gandoura Homme Estivale en Pur Lin Saharien',
    nameAr: 'قندورة رجالية صيفية من الكتان الصحراوي الصافي',
    nameEn: 'Summer Mens Linen Gandoura from the Mzab',
    descriptionFr: 'Gandoura légère et aérée confectionnée dans un lin naturel de haute qualité. Finitions au col et plastron brodé ton-sur-ton par les artisans du Mzab.',
    descriptionAr: 'قندورة صيفية خفيفة من الكتان الفاخر ومطرزة بدقة عند الياقة والصدر. راحة وانتعاش مع إطلالة أنيقة للمسجد والزيارات العائلية.',
    descriptionEn: 'Breathable and refined summer gandoura in premium natural linen, subtly detailed with tone-on-tone collar embroidery.',
    priceDzd: 12500,
    categorySlug: 'men',
    type: 'ready_to_wear',
    originRegion: 'Ghardaïa (M’zab)',
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900',
    ],
    variants: [
      { colorNameFr: 'Blanc Cassé', colorNameAr: 'أبيض مائل للبيج', colorNameEn: 'Off-White', colorHex: '#F4F1EA', size: 'M', stock: 7, sku: 'GND-MEN-WHT-M' },
      { colorNameFr: 'Blanc Cassé', colorNameAr: 'أبيض مائل للبيج', colorNameEn: 'Off-White', colorHex: '#F4F1EA', size: 'L', stock: 9, sku: 'GND-MEN-WHT-L' },
      { colorNameFr: 'Blanc Cassé', colorNameAr: 'أبيض مائل للبيج', colorNameEn: 'Off-White', colorHex: '#F4F1EA', size: 'XL', stock: 5, sku: 'GND-MEN-WHT-XL' },
      { colorNameFr: 'Bleu Touareg', colorNameAr: 'أزرق طوارقي', colorNameEn: 'Tuareg Blue', colorHex: '#264653', size: 'L', stock: 4, sku: 'GND-MEN-BLU-L' },
    ],
  },

  // 9. Traditional - Badroune
  {
    slug: 'badroune-algerois-crepe-soie',
    nameFr: 'Badroune Algérois Contemporain en Crêpe de Soie',
    nameAr: 'بدرون عاصمي معاصر من كريب الحرير',
    nameEn: 'Contemporary Algiers Badroune in Silk Crepe',
    descriptionFr: 'Combinaison-pantalon bouffant traditionnelle revisitée dans un style moderne minimaliste avec bustier brodé au fil d’argent.',
    descriptionAr: 'البدرون العاصمي بقصة عصرية ناعمة تجمع بين أناقة السروال الشلقة والسترة المطرزة بخيوط الفضة النقية.',
    descriptionEn: 'The traditional Algiers jumpsuit reinterpreted with minimalist sleek drape and fine silver needlework accents.',
    priceDzd: 28000,
    categorySlug: 'traditional',
    type: 'ready_to_wear',
    originRegion: 'Alger',
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900',
    ],
    variants: [
      { colorNameFr: 'Noir Minuit', colorNameAr: 'أسود ليلي', colorNameEn: 'Midnight Black', colorHex: '#121214', size: '38', stock: 4, sku: 'BDR-AL-BLK-38' },
      { colorNameFr: 'Noir Minuit', colorNameAr: 'أسود ليلي', colorNameEn: 'Midnight Black', colorHex: '#121214', size: '40', stock: 5, sku: 'BDR-AL-BLK-40' },
      { colorNameFr: 'Vert Olive Casbah', colorNameAr: 'زيتي كلاسيكي', colorNameEn: 'Casbah Olive', colorHex: '#556B2F', size: '38', stock: 3, sku: 'BDR-AL-OLV-38' },
    ],
  },

  // 10. Modern Men - Costume 3 Pièces
  {
    slug: 'costume-trois-pieces-laine-peignee',
    nameFr: 'Costume 3 Pièces en Laine Peignée d’Italie',
    nameAr: 'بدلة رجالية 3 قطع من الصوف الإيطالي الفاخر',
    nameEn: 'Three-Piece Suit in Italian Worsted Wool',
    descriptionFr: 'Tailleur masculin trois pièces d’exception : veste deux boutons aux finitions tailleur manuelles, gilet ajusté et pantalon à plis. Idéal pour mariages et cérémonies formelles.',
    descriptionAr: 'بدلة كلاسيكية فاخرة من ثلاث قطع: سترة أنيقة، صديرية مخصرة وسروال بتفصيل دقيق. الأناقة المثالية للأفراح واجتماعات العمل الرفيعة.',
    descriptionEn: 'Artisanal three-piece sartorial suit: two-button tailored blazer, matching vest, and pleated trousers in fine worsted wool.',
    priceDzd: 38500,
    originalPriceDzd: 44000,
    categorySlug: 'formal',
    type: 'ready_to_wear',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900',
    ],
    variants: [
      { colorNameFr: 'Bleu Nuit', colorNameAr: 'أزرق كحلي', colorNameEn: 'Midnight Navy', colorHex: '#1E293B', size: '48', stock: 3, sku: 'CST-MEN-NVY-48' },
      { colorNameFr: 'Bleu Nuit', colorNameAr: 'أزرق كحلي', colorNameEn: 'Midnight Navy', colorHex: '#1E293B', size: '50', stock: 4, sku: 'CST-MEN-NVY-50' },
      { colorNameFr: 'Bleu Nuit', colorNameAr: 'أزرق كحلي', colorNameEn: 'Midnight Navy', colorHex: '#1E293B', size: '52', stock: 2, sku: 'CST-MEN-NVY-52' },
      { colorNameFr: 'Gris Anthracite', colorNameAr: 'رمادي فحمي', colorNameEn: 'Charcoal Grey', colorHex: '#374151', size: '50', stock: 3, sku: 'CST-MEN-GRY-50' },
    ],
  },

  // 11. Modern Men - Blazer Lin
  {
    slug: 'blazer-destructure-lin-sable',
    nameFr: 'Blazer Déstructuré en Pur Lin d’Été',
    nameAr: 'سترة بليزر رجالية خفيفة من الكتان الرملي',
    nameEn: 'Unstructured Summer Linen Blazer',
    descriptionFr: 'Veste de costume déstructurée non doublée en lin respirant. Coupe contemporaine pour les journées chaudes d’Alger et d’Oran.',
    descriptionAr: 'بليزر صيفي خفيف غير مبطن من الكتان الطبيعي. قصة عصرية مريحة تلائم الطقس المتوسطي الدافئ.',
    descriptionEn: 'Unlined unstructured blazer tailored from premium breathable European flax. Effortless Mediterranean elegance.',
    priceDzd: 19500,
    categorySlug: 'casual',
    type: 'ready_to_wear',
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900',
    ],
    variants: [
      { colorNameFr: 'Sable Méditerranéen', colorNameAr: 'رملي بيج', colorNameEn: 'Sand', colorHex: '#D8C7B5', size: '48', stock: 5, sku: 'BLZ-LIN-SND-48' },
      { colorNameFr: 'Sable Méditerranéen', colorNameAr: 'رملي بيج', colorNameEn: 'Sand', colorHex: '#D8C7B5', size: '50', stock: 6, sku: 'BLZ-LIN-SND-50' },
      { colorNameFr: 'Sable Méditerranéen', colorNameAr: 'رملي بيج', colorNameEn: 'Sand', colorHex: '#D8C7B5', size: '52', stock: 3, sku: 'BLZ-LIN-SND-52' },
      { colorNameFr: 'Bleu Ciel', colorNameAr: 'أزرق سماوي', colorNameEn: 'Sky Blue', colorHex: '#93C5FD', size: '50', stock: 4, sku: 'BLZ-LIN-BLU-50' },
    ],
  },

  // 12. Modern Men - Chemise Oxford
  {
    slug: 'chemise-oxford-coton-ajustee',
    nameFr: 'Chemise Oxford en Coton d’Égypte',
    nameAr: 'قميص أكسفورد من القطن المصري الصافي',
    nameEn: 'Egyptian Cotton Oxford Button-Down Shirt',
    descriptionFr: 'Indispensable du vestiaire masculin : tissu Oxford tissé serré en coton à fibres longues, col à pointes boutonnées et boutons en nacre.',
    descriptionAr: 'قميص رجالي كلاسيكي لا غنى عنه من قماش أكسفورد المتين بالقطن المصري طويل التيلة مع أزرار صدفية متقنة.',
    descriptionEn: 'Classic menswear staple crafted from heavyweight Egyptian long-staple cotton Oxford cloth with mother-of-pearl buttons.',
    priceDzd: 7800,
    categorySlug: 'men',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900',
    ],
    variants: [
      { colorNameFr: 'Blanc Pur', colorNameAr: 'أبيض ناصع', colorNameEn: 'Crisp White', colorHex: '#FFFFFF', size: 'S', stock: 6, sku: 'SHR-OXF-WHT-S' },
      { colorNameFr: 'Blanc Pur', colorNameAr: 'أبيض ناصع', colorNameEn: 'Crisp White', colorHex: '#FFFFFF', size: 'M', stock: 12, sku: 'SHR-OXF-WHT-M' },
      { colorNameFr: 'Blanc Pur', colorNameAr: 'أبيض ناصع', colorNameEn: 'Crisp White', colorHex: '#FFFFFF', size: 'L', stock: 8, sku: 'SHR-OXF-WHT-L' },
      { colorNameFr: 'Blanc Pur', colorNameAr: 'أبيض ناصع', colorNameEn: 'Crisp White', colorHex: '#FFFFFF', size: 'XL', stock: 4, sku: 'SHR-OXF-WHT-XL' },
      { colorNameFr: 'Bleu Ciel', colorNameAr: 'أزرق فاتح', colorNameEn: 'Light Blue', colorHex: '#BAE6FD', size: 'M', stock: 7, sku: 'SHR-OXF-BLU-M' },
      { colorNameFr: 'Bleu Ciel', colorNameAr: 'أزرق فاتح', colorNameEn: 'Light Blue', colorHex: '#BAE6FD', size: 'L', stock: 5, sku: 'SHR-OXF-BLU-L' },
    ],
  },

  // 13. Modern Men - Pantalon Chino
  {
    slug: 'pantalon-chino-coton-stretch',
    nameFr: 'Pantalon Chino Ajusté en Gabardine Stretch',
    nameAr: 'سروال شينو قطني بقصة مريحة وأنيقة',
    nameEn: 'Slim-Fit Stretch Gabardine Chino Trousers',
    descriptionFr: 'Chino en sergé de coton peigné avec une pointe d’élasthanne pour un confort incomparable tout au long de la journée.',
    descriptionAr: 'سروال شينو قطني مرن ومريح للغاية مصمم للعمل والمشاوير اليومية بألوان راقية وجودة تدوم طويلاً.',
    descriptionEn: 'Tailored chino pants woven from combed cotton twill with subtle stretch for effortless daily comfort.',
    priceDzd: 6900,
    categorySlug: 'casual',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=900',
    ],
    variants: [
      { colorNameFr: 'Beige Saharien', colorNameAr: 'بيج صحراوي', colorNameEn: 'Sahara Khaki', colorHex: '#C2B280', size: '40', stock: 8, sku: 'CHN-MEN-BGE-40' },
      { colorNameFr: 'Beige Saharien', colorNameAr: 'بيج صحراوي', colorNameEn: 'Sahara Khaki', colorHex: '#C2B280', size: '42', stock: 10, sku: 'CHN-MEN-BGE-42' },
      { colorNameFr: 'Beige Saharien', colorNameAr: 'بيج صحراوي', colorNameEn: 'Sahara Khaki', colorHex: '#C2B280', size: '44', stock: 5, sku: 'CHN-MEN-BGE-44' },
      { colorNameFr: 'Bleu Marine', colorNameAr: 'كحلي', colorNameEn: 'Navy', colorHex: '#1E3A8A', size: '42', stock: 7, sku: 'CHN-MEN-NVY-42' },
      { colorNameFr: 'Vert Olive', colorNameAr: 'زيتي', colorNameEn: 'Olive', colorHex: '#3F4F3B', size: '42', stock: 6, sku: 'CHN-MEN-OLV-42' },
    ],
  },

  // 14. Modern Men - Veste Saharienne
  {
    slug: 'veste-saharienne-coton-lourd',
    nameFr: 'Veste Saharienne Inspirée du Sud Algérien',
    nameAr: 'جاكيت صحراوي كلاسيكي مستوحى من الجنوب الجزائري',
    nameEn: 'Saharienne Field Jacket in Heavy Canvas',
    descriptionFr: 'Veste baroudeuse ceinturée à quatre poches plaquées, taillée dans une robuste toile de coton lavée. Hommage aux grands espaces du Sahara.',
    descriptionAr: 'سترة صحراوية كلاسيكية بأربعة جيوب وحزام أنيق، مصنوعة من قماش قطني متين يحاكي سحر الصحراء الجزائرية الكبرى.',
    descriptionEn: 'Four-pocket belted utility field jacket inspired by Algerian Saharan heritage, cut from washed durable cotton twill.',
    priceDzd: 16500,
    originalPriceDzd: 19000,
    categorySlug: 'men',
    type: 'ready_to_wear',
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=900',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900',
    ],
    variants: [
      { colorNameFr: 'Kaki Désert', colorNameAr: 'خاكي صحراوي', colorNameEn: 'Desert Khaki', colorHex: '#8B856D', size: 'M', stock: 4, sku: 'SHR-JCK-KHK-M' },
      { colorNameFr: 'Kaki Désert', colorNameAr: 'خاكي صحراوي', colorNameEn: 'Desert Khaki', colorHex: '#8B856D', size: 'L', stock: 6, sku: 'SHR-JCK-KHK-L' },
      { colorNameFr: 'Kaki Désert', colorNameAr: 'خاكي صحراوي', colorNameEn: 'Desert Khaki', colorHex: '#8B856D', size: 'XL', stock: 3, sku: 'SHR-JCK-KHK-XL' },
      { colorNameFr: 'Tabac Foncé', colorNameAr: 'تبغي داكن', colorNameEn: 'Dark Tobacco', colorHex: '#6F4E37', size: 'L', stock: 3, sku: 'SHR-JCK-TOB-L' },
    ],
  },

  // 15. Modern Men - Trench Coat
  {
    slug: 'trench-coat-minimaliste-ceinture',
    nameFr: 'Trench Coat Minimaliste Imperméable',
    nameAr: 'معطف ترنش كلاسيكي مضاد للمطر',
    nameEn: 'Minimalist Weatherproof Belted Trench Coat',
    descriptionFr: 'Lignes architecturales épurées, bavolet tempête subtil et gabardine imperméable traitée déperlante. L’élégance urbaine par excellence.',
    descriptionAr: 'معطف ترينش أنيق بتصميم عصري ناعم وقماش مقاوم للأمطار مع حزام لتحديد الخصر وإطلالة راقية في الشتاء والربيع.',
    descriptionEn: 'Double-breasted weatherproof gabardine trench coat featuring clean lines, removable belt, and signature storm flap.',
    priceDzd: 24500,
    categorySlug: 'formal',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900',
    ],
    variants: [
      { colorNameFr: 'Beige Mastic', colorNameAr: 'بيج كلاسيكي', colorNameEn: 'Mastic Beige', colorHex: '#D6CFC7', size: '48', stock: 4, sku: 'TRN-MEN-BGE-48' },
      { colorNameFr: 'Beige Mastic', colorNameAr: 'بيج كلاسيكي', colorNameEn: 'Mastic Beige', colorHex: '#D6CFC7', size: '50', stock: 5, sku: 'TRN-MEN-BGE-50' },
      { colorNameFr: 'Noir Carbone', colorNameAr: 'أسود كربوني', colorNameEn: 'Carbon Black', colorHex: '#1C1C1E', size: '50', stock: 3, sku: 'TRN-MEN-BLK-50' },
    ],
  },

  // 16. Modern Women - Tailleur Pantalon Crêpe
  {
    slug: 'ensemble-tailleur-pantalon-crepe-ivoire',
    nameFr: 'Ensemble Tailleur Pantalon en Crêpe Ivoire',
    nameAr: 'طقم تايلور نسائي فاخر من كريب الحرير العاجي',
    nameEn: 'Ivory Silk Crepe Pant Suit Ensemble',
    descriptionFr: 'Veste de tailleur croisée à revers crantés associée à un pantalon large palazzo taille haute. Tombé lourd et fluide pour cérémonies et événements officiels.',
    descriptionAr: 'طقم بدلة نسائية راقية باللون العاجي تتكون من سترة مخصرة وبنطال بقصة بالازو عريضة تمنحك إطلالة أميرية.',
    descriptionEn: 'Double-breasted tailored blazer and wide-leg palazzo trousers in weighty fluid ivory crepe.',
    priceDzd: 32000,
    originalPriceDzd: 37000,
    categorySlug: 'formal',
    type: 'ready_to_wear',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900',
    ],
    variants: [
      { colorNameFr: 'Ivoire Nacré', colorNameAr: 'عاجي لؤلؤي', colorNameEn: 'Pearly Ivory', colorHex: '#FFFFF0', size: '36', stock: 3, sku: 'TLR-FEM-IVR-36' },
      { colorNameFr: 'Ivoire Nacré', colorNameAr: 'عاجي لؤلؤي', colorNameEn: 'Pearly Ivory', colorHex: '#FFFFF0', size: '38', stock: 5, sku: 'TLR-FEM-IVR-38' },
      { colorNameFr: 'Ivoire Nacré', colorNameAr: 'عاجي لؤلؤي', colorNameEn: 'Pearly Ivory', colorHex: '#FFFFF0', size: '40', stock: 4, sku: 'TLR-FEM-IVR-40' },
      { colorNameFr: 'Noir Smoking', colorNameAr: 'أسود سموكينغ', colorNameEn: 'Tuxedo Black', colorHex: '#0F0F10', size: '38', stock: 4, sku: 'TLR-FEM-BLK-38' },
    ],
  },

  // 17. Modern Women - Robe Portefeuille Satinée
  {
    slug: 'robe-portefeuille-satinee-emeraude',
    nameFr: 'Robe Portefeuille Satinée Vert Émeraude',
    nameAr: 'فستان ساتان ملتف باللون الأخضر الزمردي',
    nameEn: 'Emerald Satin Wrap Midi Dress',
    descriptionFr: 'Robe midi portefeuille en satin soyeux et lumineux, nouée délicatement sur le côté. Manches blousantes aux poignets boutonnés.',
    descriptionAr: 'فستان ميدي من الساتان الفاخر بقصة اللف الجانبية باللون الأخضر الزمردي الملكي مع أكمام فضفاضة وأسورة أنيقة.',
    descriptionEn: 'Lustrous emerald satin wrap midi dress featuring balloon sleeves with buttoned cuffs and fluid movement.',
    priceDzd: 15800,
    categorySlug: 'women',
    type: 'ready_to_wear',
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900',
    ],
    variants: [
      { colorNameFr: 'Vert Émeraude', colorNameAr: 'أخضر زمردي', colorNameEn: 'Emerald Green', colorHex: '#046A38', size: '38', stock: 5, sku: 'ROB-SAT-EMR-38' },
      { colorNameFr: 'Vert Émeraude', colorNameAr: 'أخضر زمردي', colorNameEn: 'Emerald Green', colorHex: '#046A38', size: '40', stock: 6, sku: 'ROB-SAT-EMR-40' },
      { colorNameFr: 'Vert Émeraude', colorNameAr: 'أخضر زمردي', colorNameEn: 'Emerald Green', colorHex: '#046A38', size: '42', stock: 3, sku: 'ROB-SAT-EMR-42' },
      { colorNameFr: 'Rouge Grenat', colorNameAr: 'أحمر قاني', colorNameEn: 'Garnet Red', colorHex: '#7E191B', size: '38', stock: 4, sku: 'ROB-SAT-RED-38' },
    ],
  },

  // 18. Modern Women - Blazer Oversize
  {
    slug: 'blazer-oversize-laine-froide-camel',
    nameFr: 'Blazer Oversize en Laine Froide Camel',
    nameAr: 'بليزر أوفرسايز من الصوف الخفيف بلون الكاميل',
    nameEn: 'Oversized Cool Wool Blazer in Camel',
    descriptionFr: 'Coupe boyish structurée aux épaules affirmées, confectionné dans une laine vierge légère adaptée à toutes les saisons.',
    descriptionAr: 'بليزر عصري واسع بأكتاف عريضة وقماش الصوف الخفيف المريح طوال العام لإطلالة تجمع بين الجرأة والرقي.',
    descriptionEn: 'Architecturally structured oversized blazer with strong shoulders tailored in Italian cool wool.',
    priceDzd: 21000,
    categorySlug: 'women',
    type: 'ready_to_wear',
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900',
    ],
    variants: [
      { colorNameFr: 'Camel Chaud', colorNameAr: 'كاميل دافئ', colorNameEn: 'Warm Camel', colorHex: '#C19A6B', size: '36', stock: 4, sku: 'BLZ-OVR-CML-36' },
      { colorNameFr: 'Camel Chaud', colorNameAr: 'كاميل دافئ', colorNameEn: 'Warm Camel', colorHex: '#C19A6B', size: '38', stock: 7, sku: 'BLZ-OVR-CML-38' },
      { colorNameFr: 'Camel Chaud', colorNameAr: 'كاميل دافئ', colorNameEn: 'Warm Camel', colorHex: '#C19A6B', size: '40', stock: 4, sku: 'BLZ-OVR-CML-40' },
      { colorNameFr: 'Gris Cendré', colorNameAr: 'رمادي رمادي', colorNameEn: 'Ash Grey', colorHex: '#9CA3AF', size: '38', stock: 3, sku: 'BLZ-OVR-GRY-38' },
    ],
  },

  // 19. Modern Women - Chemisier Satin
  {
    slug: 'chemisier-satin-de-soie-ivoire',
    nameFr: 'Chemisier Fluide en Satin de Soie Ivoire',
    nameAr: 'قميص حريري ناعم بلون العاج',
    nameEn: 'Fluid Ivory Silk Satin Blouse',
    descriptionFr: 'Chemisier au tombé caressant avec col lavallière amovible et poignets boutonnés de perles. Parfait sous un tailleur ou un Karakou déstructuré.',
    descriptionAr: 'قميص نسائي ناعم من حرير الساتان الانسيابي مع ربطة عنق حريرية اختيارية وأزرار لؤلؤية رقيقة.',
    descriptionEn: 'Sensual silk satin shirt with a removable pussy-bow necktie and refined pearlized button details.',
    priceDzd: 11500,
    categorySlug: 'women',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900',
    ],
    variants: [
      { colorNameFr: 'Ivoire', colorNameAr: 'عاجي', colorNameEn: 'Ivory', colorHex: '#FFFFF2', size: '38', stock: 6, sku: 'CHM-STN-IVR-38' },
      { colorNameFr: 'Ivoire', colorNameAr: 'عاجي', colorNameEn: 'Ivory', colorHex: '#FFFFF2', size: '40', stock: 5, sku: 'CHM-STN-IVR-40' },
      { colorNameFr: 'Ivoire', colorNameAr: 'عاجي', colorNameEn: 'Ivory', colorHex: '#FFFFF2', size: '42', stock: 3, sku: 'CHM-STN-IVR-42' },
      { colorNameFr: 'Champagne Doré', colorNameAr: 'شامبانيا مذهب', colorNameEn: 'Champagne Gold', colorHex: '#F7E7CE', size: '38', stock: 4, sku: 'CHM-STN-CHM-38' },
    ],
  },

  // 20. Modern Women - Pantalon Fluide Palazzo
  {
    slug: 'pantalon-palazzo-taille-haute-noir',
    nameFr: 'Pantalon Palazzo Fluide Taille Haute',
    nameAr: 'بنطال بالازو واسع بخصر عالي باللون الأسود',
    nameEn: 'High-Waisted Fluid Palazzo Trousers',
    descriptionFr: 'Coupe ample aérienne à plis plats qui allonge la silhouette. Matière crêpe infroissable idéale pour les journées actives.',
    descriptionAr: 'بنطال نسائي واسع وأنيق بخصر مرتفع وقماش كريب مقاوم للتجعد يمنحك راحة وأناقة لا تضاهى طوال اليوم.',
    descriptionEn: 'Wide-leg palazzo trousers with tailored front pleats that drape fluidly to elongate the silhouette.',
    priceDzd: 8900,
    categorySlug: 'women',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900',
    ],
    variants: [
      { colorNameFr: 'Noir Profond', colorNameAr: 'أسود داكن', colorNameEn: 'Deep Black', colorHex: '#111111', size: '36', stock: 5, sku: 'PLZ-FEM-BLK-36' },
      { colorNameFr: 'Noir Profond', colorNameAr: 'أسود داكن', colorNameEn: 'Deep Black', colorHex: '#111111', size: '38', stock: 8, sku: 'PLZ-FEM-BLK-38' },
      { colorNameFr: 'Noir Profond', colorNameAr: 'أسود داكن', colorNameEn: 'Deep Black', colorHex: '#111111', size: '40', stock: 6, sku: 'PLZ-FEM-BLK-40' },
      { colorNameFr: 'Blanc Crème', colorNameAr: 'أبيض كريمي', colorNameEn: 'Cream White', colorHex: '#FFFDD0', size: '38', stock: 4, sku: 'PLZ-FEM-CRM-38' },
    ],
  },

  // 21. Accessories - Khit er Rouh
  {
    slug: 'parure-khit-er-rouh-doree-traditionnelle',
    nameFr: 'Bijou de Tête Khit er Rouh Doré aux Émeraudes',
    nameAr: 'حلي الرأس خيط الروح الجزائري التقليدي المذهب',
    nameEn: 'Traditional Golden Khit er Rouh Headpiece',
    descriptionFr: 'Le joyau emblématique de la mariée algéroise, orné de motifs en rosaces et gouttes serties de cristaux émeraude et perles baroques.',
    descriptionAr: 'حلي خيط الروح العاصمي الأصيل لتزيين الجبين في الأعراس مع أحجار كريمة تحاكي الزمرد واللؤلؤ الحر.',
    descriptionEn: 'The quintessential Algerian bridal tiara/choker featuring intricate filigree rosettes with emerald drop crystals.',
    priceDzd: 14500,
    categorySlug: 'accessories',
    type: 'ready_to_wear',
    originRegion: 'Alger (La Casbah)',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900',
    ],
    variants: [
      { colorNameFr: 'Doré & Vert Émeraude', colorNameAr: 'مذهب وزمردي', colorNameEn: 'Gold & Emerald', colorHex: '#C5A059', size: 'Standard', stock: 8, sku: 'ACC-KHR-GLD-STD' },
      { colorNameFr: 'Doré & Rouge Rubis', colorNameAr: 'مذهب وياقوتي', colorNameEn: 'Gold & Ruby', colorHex: '#C5A059', size: 'Standard', stock: 5, sku: 'ACC-KHR-RUB-STD' },
    ],
  },

  // 22. Accessories - Ceinture Mdamma
  {
    slug: 'ceinture-mdamma-orfevrerie-ciselee',
    nameFr: 'Ceinture Traditionnelle Mdamma en Métal Ciselé',
    nameAr: 'حزام المضمة التقليدي الذهبي المنقوش يدوياً',
    nameEn: 'Hand-Engraved Traditional Mdamma Belt',
    descriptionFr: 'Ceinture majestueuse articulée en métal doré ciselé à la main, rehaussée de cabochons et fermoir ornemental traditionnel.',
    descriptionAr: 'حزام المضمة الفاخر المرصع بنقوش دقيقة وأحجار ملونة لإبراز خصر القفطان أو الكراكو التقليدي.',
    descriptionEn: 'Articulated metallic golden belt with hand-chiselled arabesque filigree and jewel-toned cabochon settings.',
    priceDzd: 12000,
    categorySlug: 'accessories',
    type: 'ready_to_wear',
    originRegion: 'Tlemcen',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900',
    ],
    variants: [
      { colorNameFr: 'Doré Antique', colorNameAr: 'ذهبي عتيق', colorNameEn: 'Antique Gold', colorHex: '#D4AF37', size: 'Standard', stock: 10, sku: 'ACC-MDM-GLD-STD' },
    ],
  },

  // 23. Accessories - Babouches
  {
    slug: 'babouches-cuir-naturel-constantine',
    nameFr: 'Babouches en Cuir Fait Main de Constantine',
    nameAr: 'بلغة تقليدية من الجلد الطبيعي الأصيل بقسنطينة',
    nameEn: 'Constantine Handcrafted Natural Leather Babouche',
    descriptionFr: 'Chaussons traditionnels algériens en cuir d’agneau pleine fleur, semelle cousue main et bout légèrement pointu.',
    descriptionAr: 'بلغة قسنطينية تقليدية من الجلد الطبيعي الطري، مريحة وخفيفة تليق بالبرنوس والقندورة الجزائرية.',
    descriptionEn: 'Artisanal slippers hand-stitched from supple full-grain lambskin with durable natural leather soles.',
    priceDzd: 6500,
    categorySlug: 'accessories',
    type: 'ready_to_wear',
    originRegion: 'Constantine',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900',
    ],
    variants: [
      { colorNameFr: 'Cuir Naturel Cognac', colorNameAr: 'جلد كوجناك طبيعي', colorNameEn: 'Cognac Leather', colorHex: '#9E5B32', size: '41', stock: 4, sku: 'ACC-BAB-COG-41' },
      { colorNameFr: 'Cuir Naturel Cognac', colorNameAr: 'جلد كوجناك طبيعي', colorNameEn: 'Cognac Leather', colorHex: '#9E5B32', size: '42', stock: 6, sku: 'ACC-BAB-COG-42' },
      { colorNameFr: 'Cuir Naturel Cognac', colorNameAr: 'جلد كوجناك طبيعي', colorNameEn: 'Cognac Leather', colorHex: '#9E5B32', size: '43', stock: 5, sku: 'ACC-BAB-COG-43' },
      { colorNameFr: 'Jaune Saharien', colorNameAr: 'أصفر صحراوي', colorNameEn: 'Desert Yellow', colorHex: '#EAB308', size: '42', stock: 3, sku: 'ACC-BAB-YEL-42' },
    ],
  },

  // 24. Casual - Hoodie Molleton
  {
    slug: 'hoodie-molleton-lourd-vert-foret',
    nameFr: 'Sweat à Capuche en Molleton Épais 450g',
    nameAr: 'هودي شتوي ثقيل من القطن العضوي باللون الأخضر الغابي',
    nameEn: 'Heavyweight 450gsm Loopback Fleece Hoodie',
    descriptionFr: 'Sweat à capuche au tombé lourd et volumineux, confectionné dans un molleton de coton peigné avec poche kangourou renforcée.',
    descriptionAr: 'سويت شيرت بقبعة من القطن الثقيل الممتاز، دافئ ومريح بتصميم عصري ملائم لأيام الشتاء الباردة.',
    descriptionEn: 'Premium 450gsm heavyweight cotton fleece hoodie featuring double-layered hood and ribbed side panels.',
    priceDzd: 8500,
    categorySlug: 'casual',
    type: 'ready_to_wear',
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900',
    ],
    variants: [
      { colorNameFr: 'Vert Forêt', colorNameAr: 'أخضر غابي', colorNameEn: 'Forest Green', colorHex: '#163323', size: 'M', stock: 8, sku: 'HOD-HVY-GRN-M' },
      { colorNameFr: 'Vert Forêt', colorNameAr: 'أخضر غابي', colorNameEn: 'Forest Green', colorHex: '#163323', size: 'L', stock: 11, sku: 'HOD-HVY-GRN-L' },
      { colorNameFr: 'Vert Forêt', colorNameAr: 'أخضر غابي', colorNameEn: 'Forest Green', colorHex: '#163323', size: 'XL', stock: 5, sku: 'HOD-HVY-GRN-XL' },
      { colorNameFr: 'Noir Brut', colorNameAr: 'أسود خام', colorNameEn: 'Raw Black', colorHex: '#18181B', size: 'L', stock: 9, sku: 'HOD-HVY-BLK-L' },
    ],
  },

  // 25. Casual - Jean Selvedge
  {
    slug: 'jean-selvedge-coupe-droite-brut',
    nameFr: 'Jean Brut Selvedge 14oz en Denim Pur Coton',
    nameAr: 'جينز خام سيلفدج أصيل بقصة مستقيمة كلاسيكية',
    nameEn: '14oz Raw Selvedge Straight-Leg Denim Jeans',
    descriptionFr: 'Denim non délavé tissé sur métiers à navette traditionnels avec liseré rouge selvedge aux coutures intérieures. Se patine magnifiquement avec le temps.',
    descriptionAr: 'جينز دنيم خام أصلي غير مغسول بنسيج ياباني فائق المتانة وقصة مستقيمة تتكيف مع حركة جسمك وتزداد جمالاً مع الوقت.',
    descriptionEn: 'Shuttle-loomed 14oz raw selvedge denim in deep indigo featuring clean signature selvedge edge inside the cuff.',
    priceDzd: 11000,
    categorySlug: 'casual',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=900',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900',
    ],
    variants: [
      { colorNameFr: 'Indigo Brut', colorNameAr: 'نيلي خام', colorNameEn: 'Raw Indigo', colorHex: '#1A2A40', size: '30', stock: 4, sku: 'JEA-SLV-IND-30' },
      { colorNameFr: 'Indigo Brut', colorNameAr: 'نيلي خام', colorNameEn: 'Raw Indigo', colorHex: '#1A2A40', size: '32', stock: 8, sku: 'JEA-SLV-IND-32' },
      { colorNameFr: 'Indigo Brut', colorNameAr: 'نيلي خام', colorNameEn: 'Raw Indigo', colorHex: '#1A2A40', size: '34', stock: 6, sku: 'JEA-SLV-IND-34' },
      { colorNameFr: 'Indigo Brut', colorNameAr: 'نيلي خام', colorNameEn: 'Raw Indigo', colorHex: '#1A2A40', size: '36', stock: 3, sku: 'JEA-SLV-IND-36' },
    ],
  },

  // 26. Sale - Polo Maille
  {
    slug: 'polo-maille-piquee-noir-solde',
    nameFr: 'Polo en Maille Piquée Coton Égyptien',
    nameAr: 'قميص بولو رجالي من القطن الناعم',
    nameEn: 'Egyptian Cotton Piqué Polo Shirt',
    descriptionFr: 'Polo élégant avec col chemise soigné et patte de boutonnage discrète. Maille piquée souple et fraîche.',
    descriptionAr: 'قميص بولو ناعم وأنيق بقماش قطني بارد ومريح لأوقات العمل والنشاطات اليومية.',
    descriptionEn: 'Refined knit polo tailored from airy Egyptian cotton piqué with a structured shirt collar.',
    priceDzd: 4200,
    originalPriceDzd: 6500,
    categorySlug: 'sale',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1625910513413-5bc50fcbb012?w=900',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900',
    ],
    variants: [
      { colorNameFr: 'Noir', colorNameAr: 'أسود', colorNameEn: 'Black', colorHex: '#111111', size: 'M', stock: 4, sku: 'POL-SL-BLK-M' },
      { colorNameFr: 'Noir', colorNameAr: 'أسود', colorNameEn: 'Black', colorHex: '#111111', size: 'L', stock: 3, sku: 'POL-SL-BLK-L' },
      { colorNameFr: 'Vert Forêt', colorNameAr: 'أخضر', colorNameEn: 'Forest', colorHex: '#163323', size: 'L', stock: 2, sku: 'POL-SL-GRN-L' },
    ],
  },

  // 27. Sale - T-Shirt Coton Bio
  {
    slug: 't-shirt-coton-lourd-blanc-solde',
    nameFr: 'T-Shirt Minimaliste en Coton Bio 240g',
    nameAr: 'تي شيرت قطني فاخر باللون الأبيض',
    nameEn: 'Heavyweight 240gsm Organic Cotton T-Shirt',
    descriptionFr: 'Le t-shirt blanc parfait : col côtelé dense indéformable, coupe droite impeccable et douceur naturelle.',
    descriptionAr: 'تيشيرت أبيض أساسي عالي الجودة بنسيج قطني ثقيل وياقة محكمة لا تتغير مع الغسيل.',
    descriptionEn: 'The definitive white t-shirt cut from heavy 240gsm combed organic cotton with a resilient ribbed collar.',
    priceDzd: 2900,
    originalPriceDzd: 4200,
    categorySlug: 'sale',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900',
    ],
    variants: [
      { colorNameFr: 'Blanc Optique', colorNameAr: 'أبيض ناصع', colorNameEn: 'Bright White', colorHex: '#FFFFFF', size: 'S', stock: 5, sku: 'TSH-SL-WHT-S' },
      { colorNameFr: 'Blanc Optique', colorNameAr: 'أبيض ناصع', colorNameEn: 'Bright White', colorHex: '#FFFFFF', size: 'M', stock: 8, sku: 'TSH-SL-WHT-M' },
      { colorNameFr: 'Blanc Optique', colorNameAr: 'أبيض ناصع', colorNameEn: 'Bright White', colorHex: '#FFFFFF', size: 'L', stock: 6, sku: 'TSH-SL-WHT-L' },
    ],
  },

  // 28. Traditional - Caftan Moderne
  {
    slug: 'caftan-moderne-vert-emeraude-majboud',
    nameFr: 'Caftan Moderne en Crêpe de Soie & Fil d’Or',
    nameAr: 'قفطان عصري راقي بكريب الحرير والتطريز الذهبي',
    nameEn: 'Modern Caftan in Emerald Silk Crepe & Gold Trimmings',
    descriptionFr: 'Caftan revisité avec broderies royales aux manches et buste, boutons aqqad en soie dorée faits main et ceinture sfifa assortie.',
    descriptionAr: 'قفطان جزائري أنيق يجمع بين القصة العصرية والتطريزات التقليدية مع أزرار العقد الحريرية المصنوعة يدوياً.',
    descriptionEn: 'Reimagined contemporary caftan featuring ornate golden needlework, artisanal aqqad silk buttons, and coordinating belt.',
    priceDzd: 34000,
    categorySlug: 'traditional',
    type: 'made_to_order',
    originRegion: 'Tlemcen',
    leadTimeDays: 15,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900',
    ],
    variants: [
      { colorNameFr: 'Vert Émeraude', colorNameAr: 'أخضر زمردي', colorNameEn: 'Emerald Green', colorHex: '#097969', size: '38', stock: 3, sku: 'CFT-MOD-EMR-38' },
      { colorNameFr: 'Vert Émeraude', colorNameAr: 'أخضر زمردي', colorNameEn: 'Emerald Green', colorHex: '#097969', size: '40', stock: 4, sku: 'CFT-MOD-EMR-40' },
      { colorNameFr: 'Bleu Pétrole', colorNameAr: 'أزرق بترولي', colorNameEn: 'Petroleum Blue', colorHex: '#005F73', size: '40', stock: 3, sku: 'CFT-MOD-BLU-40' },
    ],
  },

  // 29. Traditional - Melhfa Chaouie
  {
    slug: 'melhfa-chaouie-traditionnelle-aures',
    nameFr: 'Melhfa Chaouie Traditionnelle des Aurès',
    nameAr: 'ملحفة شاوية أصيلة من جبال الأوراس',
    nameEn: 'Authentic Chaoui Melhfa from the Aurès',
    descriptionFr: 'Drapé ancestral des femmes chaouies en satin noir rehaussé de galons colorés brodés aux motifs géométriques berbères.',
    descriptionAr: 'ملحفة شاوية أوراسية تقليدية مزدانة بشرائط تطريز أمازيغية متوارثة عبر الأجيال.',
    descriptionEn: 'Ancestral Chaoui draped robe detailed with colorful Berber tribal geometric ribbon borders.',
    priceDzd: 22000,
    categorySlug: 'traditional',
    type: 'ready_to_wear',
    originRegion: 'Aurès / Batna',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900',
    ],
    variants: [
      { colorNameFr: 'Noir & Rouge Chaoui', colorNameAr: 'أسود وأحمر شاوي', colorNameEn: 'Black & Red Chaoui', colorHex: '#1C1917', size: 'Standard', stock: 5, sku: 'MLH-CHW-BLK-STD' },
    ],
  },

  // 30. Wedding - Robe Soirée Satin
  {
    slug: 'robe-de-ceremonie-bustier-noir-profond',
    nameFr: 'Robe de Cérémonie Bustier en Satin Duchesse',
    nameAr: 'فستان سهرة ملكي من ساتان دوشيس الأسود',
    nameEn: 'Duchess Satin Strapless Evening Gown',
    descriptionFr: 'Robe de gala spectaculaire au bustier structuré façon haute couture et jupe sirène évasée. Présence captivante garantie.',
    descriptionAr: 'فستان سهرة كلاسيكي بقصة الكورسيه المنحوتة وساتان دوشيس الفاخر الذي يمنحك تألقاً في أرقى الحفلات.',
    descriptionEn: 'Sculptural strapless evening gown cut from structured Duchess satin with a subtle floor-skimming fishtail flare.',
    priceDzd: 27500,
    categorySlug: 'wedding',
    type: 'ready_to_wear',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=900',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900',
    ],
    variants: [
      { colorNameFr: 'Noir Ébène', colorNameAr: 'أسود أبنوسي', colorNameEn: 'Ebony Black', colorHex: '#0A0A0A', size: '36', stock: 2, sku: 'ROB-CER-BLK-36' },
      { colorNameFr: 'Noir Ébène', colorNameAr: 'أسود أبنوسي', colorNameEn: 'Ebony Black', colorHex: '#0A0A0A', size: '38', stock: 4, sku: 'ROB-CER-BLK-38' },
      { colorNameFr: 'Noir Ébène', colorNameAr: 'أسود أبنوسي', colorNameEn: 'Ebony Black', colorHex: '#0A0A0A', size: '40', stock: 3, sku: 'ROB-CER-BLK-40' },
      { colorNameFr: 'Rouge Carmin', colorNameAr: 'أحمر قرمزي', colorNameEn: 'Crimson Red', colorHex: '#990000', size: '38', stock: 3, sku: 'ROB-CER-RED-38' },
    ],
  },

  // 31. Casual - Chemise Col Mao
  {
    slug: 'chemise-col-officier-lin-blanc',
    nameFr: 'Chemise Col Officier en Pur Lin Lavé',
    nameAr: 'قميص رجالي بياقة ماو من الكتان المغسول',
    nameEn: 'Band Collar Pure Washed Linen Shirt',
    descriptionFr: 'Allure épurée et contemporaine avec son col officier sans rabat et sa matière en lin respirant naturellement texturé.',
    descriptionAr: 'قميص صيفي مريح بياقة دائرية مرتفعة وقماش كتان ناعم يناسب الإطلالات الكاجوال اليومية.',
    descriptionEn: 'Relaxed band-collar shirt crafted from garment-washed European flax with natural cooling breathability.',
    priceDzd: 8200,
    categorySlug: 'casual',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900',
    ],
    variants: [
      { colorNameFr: 'Blanc Pur', colorNameAr: 'أبيض ناصع', colorNameEn: 'Pure White', colorHex: '#FFFFFF', size: 'M', stock: 7, sku: 'CHM-MAO-WHT-M' },
      { colorNameFr: 'Blanc Pur', colorNameAr: 'أبيض ناصع', colorNameEn: 'Pure White', colorHex: '#FFFFFF', size: 'L', stock: 9, sku: 'CHM-MAO-WHT-L' },
      { colorNameFr: 'Bleu Indigo', colorNameAr: 'أزرق نيلي', colorNameEn: 'Indigo Blue', colorHex: '#1D3557', size: 'L', stock: 5, sku: 'CHM-MAO-IND-L' },
    ],
  },

  // 32. Modern Men - Manteau Laine
  {
    slug: 'manteau-long-laine-drap-charbon',
    nameFr: 'Manteau Long Droit en Drap de Laine Charbon',
    nameAr: 'معطف شتوي طويل من صوف الجوخ باللون الفحمي',
    nameEn: 'Single-Breasted Long Overcoat in Charcoal Wool',
    descriptionFr: 'Coupe droite épurée longueur genou, col tailleur cranté et fermeture trois boutons en corne. Chaleur protectrice et allure souveraine.',
    descriptionAr: 'معطف شتوي طويل أنيق بصوف الجوخ الثقيل وأزرار متقنة تمنحك حماية من برد الشتاء ومظهراً فخماً.',
    descriptionEn: 'Knee-length single-breasted wool overcoat featuring clean structured tailoring and horn buttons.',
    priceDzd: 29500,
    categorySlug: 'formal',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900',
    ],
    variants: [
      { colorNameFr: 'Gris Charbon', colorNameAr: 'رمادي فحمي', colorNameEn: 'Charcoal Grey', colorHex: '#2B2D42', size: '48', stock: 3, sku: 'MNT-MEN-CHR-48' },
      { colorNameFr: 'Gris Charbon', colorNameAr: 'رمادي فحمي', colorNameEn: 'Charcoal Grey', colorHex: '#2B2D42', size: '50', stock: 4, sku: 'MNT-MEN-CHR-50' },
      { colorNameFr: 'Gris Charbon', colorNameAr: 'رمادي فحمي', colorNameEn: 'Charcoal Grey', colorHex: '#2B2D42', size: '52', stock: 2, sku: 'MNT-MEN-CHR-52' },
      { colorNameFr: 'Noir Profond', colorNameAr: 'أسود داكن', colorNameEn: 'Deep Black', colorHex: '#111111', size: '50', stock: 3, sku: 'MNT-MEN-BLK-50' },
    ],
  },

  // 33. Women - Jupe Plissée
  {
    slug: 'jupe-midi-plissee-soleil-doree',
    nameFr: 'Jupe Midi Plissée Soleil Métallisée',
    nameAr: 'تنورة ميدي بكسرات الشمس اللامعة',
    nameEn: 'Sunray Pleated Metallic Midi Skirt',
    descriptionFr: 'Jupe plissée au tombé gracieux avec reflets dorés subtils et ceinture élastiquée confortable. Se porte aussi bien avec un pull doux qu’une chemise habillée.',
    descriptionAr: 'تنورة بكسرات دقيقة منسدلة بلمعان ذهبي هادئ وحزام خصر مطاطي يجمع بين الراحة والأناقة.',
    descriptionEn: 'Flowing sunray pleated midi skirt finished with a soft champagne metallic shimmer and comfortable waistband.',
    priceDzd: 7900,
    categorySlug: 'women',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900',
    ],
    variants: [
      { colorNameFr: 'Champagne Doré', colorNameAr: 'شامبانيا مذهب', colorNameEn: 'Golden Champagne', colorHex: '#E5C378', size: 'S', stock: 4, sku: 'JUP-PLS-GLD-S' },
      { colorNameFr: 'Champagne Doré', colorNameAr: 'شامبانيا مذهب', colorNameEn: 'Golden Champagne', colorHex: '#E5C378', size: 'M', stock: 7, sku: 'JUP-PLS-GLD-M' },
      { colorNameFr: 'Champagne Doré', colorNameAr: 'شامبانيا مذهب', colorNameEn: 'Golden Champagne', colorHex: '#E5C378', size: 'L', stock: 5, sku: 'JUP-PLS-GLD-L' },
    ],
  },

  // 34. Women - Cardigan Mérinos
  {
    slug: 'cardigan-maille-cotelee-laine-merinos',
    nameFr: 'Cardigan en Maille Côtelée Laine Mérinos Écru',
    nameAr: 'سترة كارديغان صوفية ناعمة من صوف الميرينوس',
    nameEn: 'Ribbed Merino Wool Cardigan in Ecru',
    descriptionFr: 'Gilet boutonné moelleux en pure laine mérinos extra-fine. Boutons d’écaille végétale et emmanchures descendues pour un style cosy et chic.',
    descriptionAr: 'كارديغان نسائي محبوك من صوف الميرينوس الخالص فائق النعومة والدفء بأزرار صدفية وتصميم عصري ناعم.',
    descriptionEn: 'Cozy chunky cardigan knitted from extrafine merino wool yarns, complemented by tortoiseshell buttons.',
    priceDzd: 11900,
    categorySlug: 'casual',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900',
    ],
    variants: [
      { colorNameFr: 'Écru Naturel', colorNameAr: 'سكري طبيعي', colorNameEn: 'Natural Ecru', colorHex: '#FBF9F1', size: 'S', stock: 5, sku: 'CRD-MER-ECR-S' },
      { colorNameFr: 'Écru Naturel', colorNameAr: 'سكري طبيعي', colorNameEn: 'Natural Ecru', colorHex: '#FBF9F1', size: 'M', stock: 6, sku: 'CRD-MER-ECR-M' },
      { colorNameFr: 'Écru Naturel', colorNameAr: 'سكري طبيعي', colorNameEn: 'Natural Ecru', colorHex: '#FBF9F1', size: 'L', stock: 3, sku: 'CRD-MER-ECR-L' },
    ],
  },

  // 35. Accessories - Sac Cuir Alger
  {
    slug: 'sac-cabas-cuir-graine-alger',
    nameFr: 'Sac Cabas en Cuir Grainé Confectionné à Alger',
    nameAr: 'حقيبة يد نسائية من الجلد الطبيعي المحبب صناعة العاصمة',
    nameEn: 'Algiers Crafted Grained Leather Tote Bag',
    descriptionFr: 'Cabas structuré en cuir bovin pleine fleur façonné dans nos ateliers maroquiniers d’Alger. Doublure en suédine douce et fermoir magnétique.',
    descriptionAr: 'حقيبة تسوق يد وتكتف فخمة من الجلد البقري الطبيعي الأصيل المصنوع ببراعة في ورشاتنا بالعاصمة الجزائر.',
    descriptionEn: 'Generous everyday tote bag crafted in Algiers from premium pebbled leather with reinforced shoulder handles.',
    priceDzd: 18000,
    categorySlug: 'accessories',
    type: 'ready_to_wear',
    originRegion: 'Alger',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900',
    ],
    variants: [
      { colorNameFr: 'Noir Intense', colorNameAr: 'أسود فاحم', colorNameEn: 'Intense Black', colorHex: '#121212', size: 'Unique', stock: 7, sku: 'ACC-BAG-BLK-UNI' },
      { colorNameFr: 'Camel Cuir', colorNameAr: 'كاميل جلدي', colorNameEn: 'Camel Tan', colorHex: '#B87333', size: 'Unique', stock: 5, sku: 'ACC-BAG-CML-UNI' },
    ],
  },

  // 36. Accessories - Pashmina
  {
    slug: 'echarpe-pashmina-cachemire-soie',
    nameFr: 'Écharpe Pashmina en Cachemire & Soie',
    nameAr: 'وشاح باشمينا فاخر من الكشمير والحرير',
    nameEn: 'Cashmere & Silk Pashmina Shawl',
    descriptionFr: 'Étole d’une douceur incomparable tissée avec un mélange soyeux de cachemire noble et de soie naturelle. Finitions franges torsadées à la main.',
    descriptionAr: 'شال أنيق وناعم يلفك بالدفء والخفة مصنوع من أجود أنواع الكشمير والحرير مع شراشيب يدوية رقيقة.',
    descriptionEn: 'Featherlight oversized pashmina shawl woven from noble Himalayan cashmere and Mulberry silk with hand-twisted fringes.',
    priceDzd: 8500,
    categorySlug: 'accessories',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=900',
    ],
    variants: [
      { colorNameFr: 'Vert Forêt', colorNameAr: 'أخضر غابي', colorNameEn: 'Forest Green', colorHex: '#163323', size: 'Unique', stock: 8, sku: 'ACC-PSH-GRN-UNI' },
      { colorNameFr: 'Bordeaux Profond', colorNameAr: 'عنابي دافئ', colorNameEn: 'Deep Burgundy', colorHex: '#6B1D2F', size: 'Unique', stock: 6, sku: 'ACC-PSH-BUR-UNI' },
      { colorNameFr: 'Beige Sable', colorNameAr: 'بيج رملي', colorNameEn: 'Sand Beige', colorHex: '#D8C7B5', size: 'Unique', stock: 10, sku: 'ACC-PSH-BGE-UNI' },
    ],
  },

  // 37. Sale - Robe Plissée
  {
    slug: 'robe-fluide-imprime-abstrait-solde',
    nameFr: 'Robe Midi Fluide à Motif Minimaliste',
    nameAr: 'فستان ميدي خفيف بنقشة تجريدية هادئة',
    nameEn: 'Fluid Abstract Print Midi Dress',
    descriptionFr: 'Robe légère ceinturée à encolure ronde et coupe dansante. Idéale pour les sorties décontractées.',
    descriptionAr: 'فستان خفيف ومريح بألوان متناسقة وحزام لتحديد الخصر ملائم للمشاوير واللقاءات اليومية.',
    descriptionEn: 'Breezy belted midi dress in a subtle abstract geometric print with keyhole back closure.',
    priceDzd: 6500,
    originalPriceDzd: 9800,
    categorySlug: 'sale',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900',
    ],
    variants: [
      { colorNameFr: 'Noir & Crème', colorNameAr: 'أسود وكريمي', colorNameEn: 'Black & Cream', colorHex: '#222222', size: '38', stock: 3, sku: 'ROB-SL-BC-38' },
      { colorNameFr: 'Noir & Crème', colorNameAr: 'أسود وكريمي', colorNameEn: 'Black & Cream', colorHex: '#222222', size: '40', stock: 2, sku: 'ROB-SL-BC-40' },
    ],
  },

  // 38. Men - Veste en Cuir
  {
    slug: 'blouson-bombardier-daim-tabac',
    nameFr: 'Blouson Bombardier en Cuir Velours Tabac',
    nameAr: 'جاكيت بومبر رجالي من جلد الغزال الفاخر بلون التبغ',
    nameEn: 'Suede Leather Bomber Jacket in Tobacco Tan',
    descriptionFr: 'Blouson d’inspiration aviateur en cuir suédé velouté avec col et poignets en bord-côte dense. Fermeture zippée en laiton vieilli.',
    descriptionAr: 'جاكيت جلدي رجالي من السويد الناعم مع ياقة وأكمام مطاطية وسحاب معدني ذهبي عتيق يمنحك إطلالة شبابية راقية.',
    descriptionEn: 'Vintage-inspired flight bomber jacket crafted from velvety goat suede leather with brass zip hardware.',
    priceDzd: 32000,
    categorySlug: 'men',
    type: 'ready_to_wear',
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900',
    ],
    variants: [
      { colorNameFr: 'Tabac Doré', colorNameAr: 'تبغي مذهب', colorNameEn: 'Golden Tobacco', colorHex: '#A45A2A', size: 'M', stock: 3, sku: 'JCK-BMB-TOB-M' },
      { colorNameFr: 'Tabac Doré', colorNameAr: 'تبغي مذهب', colorNameEn: 'Golden Tobacco', colorHex: '#A45A2A', size: 'L', stock: 5, sku: 'JCK-BMB-TOB-L' },
      { colorNameFr: 'Tabac Doré', colorNameAr: 'تبغي مذهب', colorNameEn: 'Golden Tobacco', colorHex: '#A45A2A', size: 'XL', stock: 2, sku: 'JCK-BMB-TOB-XL' },
    ],
  },

  // 39. Traditional - Seroual Chelka
  {
    slug: 'seroual-chelka-soie-alger',
    nameFr: 'Seroual Chelka Traditionnel en Soie Blanche',
    nameAr: 'سروال شلقة عاصمي تقليدي من الحرير الأبيض',
    nameEn: 'Algiers Silk Seroual Chelka Trousers',
    descriptionFr: 'Pantalon bouffant fendu sur les côtés emblématique du costume d’Alger. Confectionné en satin de soie de Lyon avec boutons de passementerie.',
    descriptionAr: 'سروال الشلقة العاصمي التقليدي بفتحاته الجانبية الشهيرة وأزرار القيطون المنسوجة يدوياً ليتكامل مع الكراكو.',
    descriptionEn: 'Traditional Algiers split harem trousers in lustrous white silk satin with decorative passementerie buttons.',
    priceDzd: 16500,
    categorySlug: 'traditional',
    type: 'ready_to_wear',
    originRegion: 'Alger',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900',
    ],
    variants: [
      { colorNameFr: 'Blanc Soie', colorNameAr: 'أبيض حريري', colorNameEn: 'Silk White', colorHex: '#FDFDFD', size: '38', stock: 4, sku: 'SRW-CHL-WHT-38' },
      { colorNameFr: 'Blanc Soie', colorNameAr: 'أبيض حريري', colorNameEn: 'Silk White', colorHex: '#FDFDFD', size: '40', stock: 5, sku: 'SRW-CHL-WHT-40' },
      { colorNameFr: 'Or Vénitien', colorNameAr: 'ذهبي فينيسي', colorNameEn: 'Venetian Gold', colorHex: '#E5C378', size: '40', stock: 3, sku: 'SRW-CHL-GLD-40' },
    ],
  },

  // 40. Accessories - Cravate Soie
  {
    slug: 'cravate-soie-grenadine-bleu-nuit',
    nameFr: 'Cravate en Soie Tissée Façon Grenadine',
    nameAr: 'ربطة عنق من الحرير المنسوج باللون الكحلي',
    nameEn: 'Handmade Silk Grenadine Tie in Midnight Navy',
    descriptionFr: 'Cravate artisanale sept plis en soie grenadine à texture gaufrée noble. Fabriquée pour rehausser les costumes habillés.',
    descriptionAr: 'ربطة عنق كلاسيكية فاخرة من الحرير الطبيعي المنسوج بنسيج محبب راق يضفي هيبة على بدلتك الرسمية.',
    descriptionEn: 'Artisanal silk grenadine necktie with tactile woven honeycomb texture and untipped hand-rolled edges.',
    priceDzd: 4900,
    categorySlug: 'accessories',
    type: 'ready_to_wear',
    images: [
      'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=900',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900',
    ],
    variants: [
      { colorNameFr: 'Bleu Nuit', colorNameAr: 'كحلي ليلي', colorNameEn: 'Midnight Navy', colorHex: '#1E293B', size: 'Standard', stock: 12, sku: 'ACC-TIE-NVY-STD' },
      { colorNameFr: 'Bordeaux Royal', colorNameAr: 'عنابي ملكي', colorNameEn: 'Royal Burgundy', colorHex: '#661424', size: 'Standard', stock: 8, sku: 'ACC-TIE-BUR-STD' },
    ],
  },

  // 41. Traditional - Caftan Blanc Mariage
  {
    slug: 'caftan-nuptial-soie-brode-or-alger',
    nameFr: 'Caftan Nuptial en Satin de Soie & Plastron d’Or',
    nameAr: 'قفطان العرس الأبيض المطرز بخيوط الذهب الخالص',
    nameEn: 'Bridal White Silk Caftan with Gold Filigree Chest',
    descriptionFr: 'Création d’apparat pour la mariée moderne : soierie blanche virginale ornée d’un plastron en broderie fil d’or Majboud et pierres fines.',
    descriptionAr: 'تصميم ملكي لعرائس ماي ستايل: حرير أبيض ساحر مطرز بالمجبود الذهبي مع حزام مدمة متناسق.',
    descriptionEn: 'Opulent bridal ceremonial caftan tailored in bridal silk satin featuring hand-threaded Majboud filigree breastplate.',
    priceDzd: 56000,
    categorySlug: 'wedding',
    type: 'made_to_order',
    originRegion: 'Alger',
    leadTimeDays: 21,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=900',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900',
    ],
    variants: [
      { colorNameFr: 'Blanc Nuptial', colorNameAr: 'أبيض عرائسي', colorNameEn: 'Bridal White', colorHex: '#FFFFFF', size: '38', stock: 3, sku: 'CFT-NUP-WHT-38' },
      { colorNameFr: 'Blanc Nuptial', colorNameAr: 'أبيض عرائسي', colorNameEn: 'Bridal White', colorHex: '#FFFFFF', size: '40', stock: 4, sku: 'CFT-NUP-WHT-40' },
    ],
  },

  // 42. Women - Trench Coat Fluide
  {
    slug: 'trench-long-fluide-kaki-ceinture',
    nameFr: 'Trench-Coat Fluide Long en Tencel Ceinturé',
    nameAr: 'معطف ترينش ناعم وطويل باللون الخاكي مع حزام',
    nameEn: 'Fluid Tencel Long Trench Coat in Khaki',
    descriptionFr: 'Trench féminin au drapé ultra-souple en fibres de tencel respirantes. Épaulettes amovibles et fente dos pour une allure résolument moderne.',
    descriptionAr: 'معطف ترنش نسائي انسيابي طويل من ألياف التنسيل الناعمة، خفيف وأنيق مع حزام يبرز جمال القوام.',
    descriptionEn: 'Flowing drape trench coat cut in breathable eco-tencel featuring deep storm flaps and storm welt pockets.',
    priceDzd: 18900,
    categorySlug: 'women',
    type: 'ready_to_wear',
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900',
    ],
    variants: [
      { colorNameFr: 'Kaki Sauge', colorNameAr: 'خاكي مائل للرمادي', colorNameEn: 'Sage Khaki', colorHex: '#77815C', size: '38', stock: 4, sku: 'TRN-FEM-KHK-38' },
      { colorNameFr: 'Kaki Sauge', colorNameAr: 'خاكي مائل للرمادي', colorNameEn: 'Sage Khaki', colorHex: '#77815C', size: '40', stock: 5, sku: 'TRN-FEM-KHK-40' },
      { colorNameFr: 'Noir Minuit', colorNameAr: 'أسود ليلي', colorNameEn: 'Midnight Black', colorHex: '#141416', size: '38', stock: 4, sku: 'TRN-FEM-BLK-38' },
    ],
  },
];
