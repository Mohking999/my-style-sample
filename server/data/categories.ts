export interface CategoryData {
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  order: number;
}

export const CATEGORIES_DATA: CategoryData[] = [
  {
    slug: 'new-arrivals',
    nameFr: 'Nouveautés',
    nameAr: 'وصل حديثاً',
    nameEn: 'New Arrivals',
    descriptionFr: 'Les dernières créations modernes et traditionnelles tout juste sorties d’atelier.',
    descriptionAr: 'أحدث التصاميم العصرية والقطع التقليدية الجديدة من ورشاتنا.',
    descriptionEn: 'The latest modern and traditional creations freshly crafted in our ateliers.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    order: 1,
  },
  {
    slug: 'women',
    nameFr: 'Femmes',
    nameAr: 'نساء',
    nameEn: 'Women',
    descriptionFr: 'Vestiaire féminin alliant coupes contemporaines épurées et silhouettes raffinées.',
    descriptionAr: 'تشكيلة نسائية راقية تجمع بين القصات العصرية والأنوثة الهادئة.',
    descriptionEn: 'Women collection blending clean contemporary silhouettes and timeless poise.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    order: 2,
  },
  {
    slug: 'men',
    nameFr: 'Hommes',
    nameAr: 'رجال',
    nameEn: 'Men',
    descriptionFr: 'Élégance masculine méditerranéenne : costumes, chemises en lin et coupes décontractées.',
    descriptionAr: 'أناقة رجالية متوسطية تجمع بين البدلات الفاخرة والأقمشة المريحة.',
    descriptionEn: 'Mediterranean menswear tailoring, crisp shirts, and elevated everyday cuts.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    order: 3,
  },
  {
    slug: 'traditional',
    nameFr: 'Collection Traditionnelle',
    nameAr: 'المجموعة التقليدية',
    nameEn: 'Traditional Collection',
    descriptionFr: 'Joyaux du patrimoine algérien : Karakou algérois, Chedda de Tlemcen, Blouza et Burnous impériaux.',
    descriptionAr: 'كنوز التراث الجزائري العريق: كراكو عاصمي، شدة تلمسانية، بلوزة وهرانية وبرنوس ملكي.',
    descriptionEn: 'Jewels of Algerian heritage: Karakou, Tlemcen Chedda, Oran Blouza, and imperial Burnous.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',
    order: 4,
  },
  {
    slug: 'formal',
    nameFr: 'Tenues Habillées',
    nameAr: 'ملابس رسمية',
    nameEn: 'Formal Wear',
    descriptionFr: 'Tailleurs stricts, smokings en laine et robes de cocktail pour vos réunions et réceptions.',
    descriptionAr: 'بدلات كلاسيكية فاخرة وفساتين سهرة راقية للمناسبات الرسمية واجتماعات العمل.',
    descriptionEn: 'Tailored suits, wool blazers, and evening dresses for prestigious gatherings.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    order: 5,
  },
  {
    slug: 'casual',
    nameFr: 'Tenues Quotidiennes',
    nameAr: 'ملابس يومية',
    nameEn: 'Casual Wear',
    descriptionFr: 'Des pièces confortables et élégantes pensées pour la ville et les week-ends détendus.',
    descriptionAr: 'أزياء مريحة وأنيقة مصممة للحياة الحضرية والأوقات الهادئة.',
    descriptionEn: 'Effortless relaxed staples curated for active city life and weekend ease.',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800',
    order: 6,
  },
  {
    slug: 'wedding',
    nameFr: 'Mariages & Cérémonies',
    nameAr: 'أعراس ومناسبات',
    nameEn: 'Wedding & Occasion',
    descriptionFr: 'Tenues d’apparat et créations sur-mesure pour célébrer les plus beaux moments d’une vie.',
    descriptionAr: 'أزياء الفخامة والأعراس مع إمكانية التفصيل حسب الطلب لأبهى إطلالة في ليلة العمر.',
    descriptionEn: 'Celebratory ceremonial wear and couture made-to-order creations.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800',
    order: 7,
  },
  {
    slug: 'accessories',
    nameFr: 'Accessoires',
    nameAr: 'إكسسوارات',
    nameEn: 'Accessories',
    descriptionFr: 'Foulards en soie, ceintures en cuir véritable, Khit er Rouh et parures régionales.',
    descriptionAr: 'أوشحة حريرية، أحزمة جلدية أصلية، خيط الروح وحلي تقليدية متميزة.',
    descriptionEn: 'Silk scarves, genuine leather belts, Khit er Rouh, and regional Algerian jewelry.',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
    order: 8,
  },
  {
    slug: 'sale',
    nameFr: 'Soldes',
    nameAr: 'تخفيضات',
    nameEn: 'Sale',
    descriptionFr: 'Profitez de remises exceptionnelles sur nos pièces prêt-à-porter de fin de saison.',
    descriptionAr: 'استفيدوا من تخفيضات استثنائية على تشكيلات نهاية الموسم الجاهزة للبس.',
    descriptionEn: 'Exceptional discounts on select ready-to-wear seasonal garments.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    order: 9,
  },
];
