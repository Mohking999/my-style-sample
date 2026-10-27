PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS "User";
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

DROP TABLE IF EXISTS "Category";
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionFr" TEXT,
    "descriptionAr" TEXT,
    "descriptionEn" TEXT,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "Wilaya";
CREATE TABLE "Wilaya" (
    "code" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "homeDeliveryFee" INTEGER NOT NULL DEFAULT 800,
    "relayDeliveryFee" INTEGER NOT NULL DEFAULT 450,
    "active" BOOLEAN NOT NULL DEFAULT true
);

DROP TABLE IF EXISTS "DiscountCode";
CREATE TABLE "DiscountCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'percentage',
    "value" INTEGER NOT NULL,
    "minOrderDzd" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "Address";
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "wilayaCode" INTEGER NOT NULL,
    "wilayaName" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Product";
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "priceDzd" INTEGER NOT NULL,
    "originalPriceDzd" INTEGER,
    "categoryId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ready_to_wear',
    "originRegion" TEXT,
    "leadTimeDays" INTEGER DEFAULT 14,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "images" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "ProductVariant";
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "colorNameFr" TEXT NOT NULL,
    "colorNameAr" TEXT NOT NULL,
    "colorNameEn" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT NOT NULL,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "Order";
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "wilayaCode" INTEGER NOT NULL,
    "wilayaName" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "deliveryType" TEXT NOT NULL DEFAULT 'home',
    "paymentMethod" TEXT NOT NULL DEFAULT 'cod',
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "subtotalDzd" INTEGER NOT NULL,
    "deliveryFeeDzd" INTEGER NOT NULL,
    "discountDzd" INTEGER NOT NULL DEFAULT 0,
    "discountCode" TEXT,
    "totalDzd" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "OrderItem";
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "title" TEXT NOT NULL,
    "color" TEXT,
    "size" TEXT,
    "priceDzd" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "image" TEXT,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "OrderStatusHistory";
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "TailoringRequest";
CREATE TABLE "TailoringRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT,
    "userPhone" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "measurements" TEXT,
    "standardSize" TEXT,
    "color" TEXT,
    "embroideryOption" TEXT,
    "fabricVariation" TEXT,
    "notes" TEXT,
    "desiredDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "quotedPriceDzd" INTEGER,
    "estimatedDays" INTEGER,
    "adminNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TailoringRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TailoringRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");

CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

INSERT INTO "Address" VALUES('21785e0b-25cb-4736-93bd-7f5dcc16de34','e4b30ecb-0f96-4bb7-bb14-d750c5797789','Leila Mansouri','0555778899',16,'Alger','Hydra','Résidence Les Pins, Bâtiment B, Apt 14',1,1793128168226);

INSERT INTO "Category" VALUES('e6b3a7f5-d995-4138-97b4-35339a577b6f','new-arrivals','Nouveautés','وصل حديثاً','New Arrivals','Les dernières créations modernes et traditionnelles tout juste sorties d’atelier.','أحدث التصاميم العصرية والقطع التقليدية الجديدة من ورشاتنا.','The latest modern and traditional creations freshly crafted in our ateliers.','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',1,1793128162574);

INSERT INTO "Category" VALUES('b2cd394d-d198-4c64-8cc4-3aacf3536f11','women','Femmes','نساء','Women','Vestiaire féminin alliant coupes contemporaines épurées et silhouettes raffinées.','تشكيلة نسائية راقية تجمع بين القصات العصرية والأنوثة الهادئة.','Women collection blending clean contemporary silhouettes and timeless poise.','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',2,1793128163057);

INSERT INTO "Category" VALUES('7b1c03c1-a801-49ba-92d7-c37cfb6d29f1','men','Hommes','رجال','Men','Élégance masculine méditerranéenne : costumes, chemises en lin et coupes décontractées.','أناقة رجالية متوسطية تجمع بين البدلات الفاخرة والأقمشة المريحة.','Mediterranean menswear tailoring, crisp shirts, and elevated everyday cuts.','https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',3,1793128163430);

INSERT INTO "Category" VALUES('2093c166-a25d-4385-853c-4d74345326e6','traditional','Collection Traditionnelle','المجموعة التقليدية','Traditional Collection','Joyaux du patrimoine algérien : Karakou algérois, Chedda de Tlemcen, Blouza et Burnous impériaux.','كنوز التراث الجزائري العريق: كراكو عاصمي، شدة تلمسانية، بلوزة وهرانية وبرنوس ملكي.','Jewels of Algerian heritage: Karakou, Tlemcen Chedda, Oran Blouza, and imperial Burnous.','https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800',4,1793128163772);

INSERT INTO "Category" VALUES('48c24d48-642b-4c8f-a363-95f7a7b94c40','formal','Tenues Habillées','ملابس رسمية','Formal Wear','Tailleurs stricts, smokings en laine et robes de cocktail pour vos réunions et réceptions.','بدلات كلاسيكية فاخرة وفساتين سهرة راقية للمناسبات الرسمية واجتماعات العمل.','Tailored suits, wool blazers, and evening dresses for prestigious gatherings.','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',5,1793128164112);

INSERT INTO "Category" VALUES('c58d9ea1-bf6f-4dd8-9998-77dcdcba3d4c','casual','Tenues Quotidiennes','ملابس يومية','Casual Wear','Des pièces confortables et élégantes pensées pour la ville et les week-ends détendus.','أزياء مريحة وأنيقة مصممة للحياة الحضرية والأوقات الهادئة.','Effortless relaxed staples curated for active city life and weekend ease.','https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800',6,1793128164541);

INSERT INTO "Category" VALUES('a6c933c5-fe3e-48e7-bf24-5ec396131080','wedding','Mariages & Cérémonies','أعراس ومناسبات','Wedding & Occasion','Tenues d’apparat et créations sur-mesure pour célébrer les plus beaux moments d’une vie.','أزياء الفخامة والأعراس مع إمكانية التفصيل حسب الطلب لأبهى إطلالة في ليلة العمر.','Celebratory ceremonial wear and couture made-to-order creations.','https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800',7,1793128164926);

INSERT INTO "Category" VALUES('257f2c10-724f-4c1e-852d-e0c59d6a9796','accessories','Accessoires','إكسسوارات','Accessories','Foulards en soie, ceintures en cuir véritable, Khit er Rouh et parures régionales.','أوشحة حريرية، أحزمة جلدية أصلية، خيط الروح وحلي تقليدية متميزة.','Silk scarves, genuine leather belts, Khit er Rouh, and regional Algerian jewelry.','https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',8,1793128165301);

INSERT INTO "Category" VALUES('aea9ebbf-27c3-4000-b698-e8b2a4640528','sale','Soldes','تخفيضات','Sale','Profitez de remises exceptionnelles sur nos pièces prêt-à-porter de fin de saison.','استفيدوا من تخفيضات استثنائية على تشكيلات نهاية الموسم الجاهزة للبس.','Exceptional discounts on select ready-to-wear seasonal garments.','https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',9,1793128165685);

INSERT INTO "DiscountCode" VALUES('07efe953-47a0-4a51-857c-dc3212d4ccef','SAHRA10','percentage',10,5000,1,NULL,1793128168627);

INSERT INTO "DiscountCode" VALUES('d139739c-20e5-4523-a47a-7d3e380d4229','BIENVENUE','fixed',1000,10000,1,NULL,1793128169002);

INSERT INTO "DiscountCode" VALUES('8579b386-5a3d-4e78-b124-09b7f4c7fa82','EID2026','percentage',15,15000,1,NULL,1793128169366);

INSERT INTO "Order" VALUES('bed43add-29a3-4a12-8125-9a6939679317','DZ-2026-08421','e4b30ecb-0f96-4bb7-bb14-d750c5797789','Leila Mansouri','0555778899',16,'Alger','Hydra','Résidence Les Pins, Bâtiment B, Apt 14','home','cod','Appeler avant de passer svp','shipped',43800,500,1000,'BIENVENUE',43300,1793128234669,1793128234669);

INSERT INTO "Order" VALUES('8f9bf21c-fc5a-42aa-9cbf-900b3739cb33','DZ-2026-07914','e4b30ecb-0f96-4bb7-bb14-d750c5797789','Leila Mansouri','0555778899',31,'Oran','Akid Lotfi','Boulevard Millenium, Villa N° 12','home','cod',NULL,'delivered',26000,750,0,NULL,26750,1793128235093,1793128235093);

INSERT INTO "OrderItem" VALUES('ee892346-1b6e-47e5-a0b7-c8fa933f2ca6','bed43add-29a3-4a12-8125-9a6939679317','fcb77c6d-098f-47c6-8455-29a63c5f16b0','70fc2219-b525-4eb5-9f66-f521ebac020f','Burnous Royal Homme en Pure Laine & Poil de Chameau','Brun Chameau','L',36000,1,'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900');

INSERT INTO "OrderItem" VALUES('e18afd79-6602-45dd-9c8d-efb3b19c9230','bed43add-29a3-4a12-8125-9a6939679317','52427ab2-de03-4f60-b211-e4449489ac44','e271941d-8d85-41f7-8294-7b0b03f41205','Chemise Oxford en Coton d’Égypte','Blanc Pur','S',7800,1,'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900');

INSERT INTO "OrderItem" VALUES('61f16736-bebd-4891-8cf1-bc38eefcbf1f','8f9bf21c-fc5a-42aa-9cbf-900b3739cb33','12c0aa53-d127-4d5d-8484-f7d7d8ca3324','d9732b6e-17b5-4105-a46f-3c2371392be3','Blouza Oranaise en Dentelle Perle & Soie','Bleu Royal','38',26000,1,'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900');

INSERT INTO "OrderStatusHistory" VALUES('85f40707-d42e-4a6e-954f-54dac723d562','bed43add-29a3-4a12-8125-9a6939679317','pending','Commande passée en ligne par le client',1793128234669);

INSERT INTO "OrderStatusHistory" VALUES('d24b35f3-82a0-4653-a2e9-ea9cacb1d0db','bed43add-29a3-4a12-8125-9a6939679317','confirmed','Commande confirmée par téléphone par Nadia',1793128234669);

INSERT INTO "OrderStatusHistory" VALUES('15ce08a1-065e-4cbd-a8b2-ab29348d47a0','bed43add-29a3-4a12-8125-9a6939679317','preparing','Colis emballé avec soin dans notre atelier',1793128234669);

INSERT INTO "OrderStatusHistory" VALUES('06e2d394-3fc5-4756-a731-9c74a66d6aab','bed43add-29a3-4a12-8125-9a6939679317','shipped','Pris en charge par notre transporteur express Yalidine',1793128234669);

INSERT INTO "OrderStatusHistory" VALUES('4b9663e4-3dd7-4e90-a74f-ddc6f80745f7','8f9bf21c-fc5a-42aa-9cbf-900b3739cb33','pending','Commande reçue',1793128235093);

INSERT INTO "OrderStatusHistory" VALUES('79e7a02d-a95c-41dc-8fb1-d7af11a6e0b8','8f9bf21c-fc5a-42aa-9cbf-900b3739cb33','confirmed','Confirmation client validée',1793128235093);

INSERT INTO "OrderStatusHistory" VALUES('540625ba-1a57-450f-ac06-241ab7716be6','8f9bf21c-fc5a-42aa-9cbf-900b3739cb33','preparing','Préparation',1793128235093);

INSERT INTO "OrderStatusHistory" VALUES('05cda5df-c773-4469-9567-ed857b6c8410','8f9bf21c-fc5a-42aa-9cbf-900b3739cb33','shipped','Expédié',1793128235093);

INSERT INTO "OrderStatusHistory" VALUES('3b3a58eb-fc6f-4617-9663-cd56de571f79','8f9bf21c-fc5a-42aa-9cbf-900b3739cb33','delivered','Colis remis en main propre et paiement encaissé',1793128235093);

INSERT INTO "Product" VALUES('608f1e0c-d317-49c4-b018-d60fb2591eb9','karakou-algerois-royal-majboud','Karakou Algérois Royal en Velours & Majboud','كراكو عاصمي ملكي من المخمل والمجبود المذهب','Royal Algiers Karakou in Velvet & Majboud Gold Embroidery','Veste cintrée en velours de Gênes pourpre brodée artisanalement au fil d’or Majboud selon la tradition algéroise séculaire. Pièce d’exception pour mariages et cérémonies d’honneur.','سترة مخملية فاخرة مطرزة يدوياً بخيوط المجبود الذهبية الأصيلة وفق تقاليد القصبة العاصمية العريقة. تحفة للمناسبات والأعراس الفاخرة.','Fitted velvet jacket meticulously hand-embroidered with authentic golden Majboud threads following centuries of Algiers Casbah couture tradition.',48000,55000,'2093c166-a25d-4385-853c-4d74345326e6','made_to_order','Alger (La Casbah)',18,1,0,1,1,'["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900","https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=900"]',1793128169830,1793128169830);

INSERT INTO "Product" VALUES('86ddcf25-0a6c-4025-8e4d-7974eb160607','chedda-tlemcenia-imperiale','Chedda Tlemcenia Impériale Haute Couture','شدة تلمسانية ملكية فاخرة','Imperial Tlemcen Chedda Haute Couture','Ensemble nuptial traditionnel inscrit au patrimoine mondial. Kaftan en velours brodé Fetla et Majboud, plastron de perles et finitions orfèvres réalisées par les maîtres artisans de Tlemcen.','لباس العروس التلمساني المصنف كتراث عالمي إنساني. قفطان مخملي مطرز بالفتلة والمجبود مع صدرية مرصعة بالخرز واللؤلؤ.','The iconic bridal ensemble registered as UNESCO World Heritage. Velvet caftan hand-embroidered with gold cord and freshwater pearls.',75000,NULL,'2093c166-a25d-4385-853c-4d74345326e6','made_to_order','Tlemcen',25,1,0,0,1,'["https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900","https://images.unsplash.com/photo-1544441893-675973e31985?w=900"]',1793128172461,1793128172461);

INSERT INTO "Product" VALUES('12c0aa53-d127-4d5d-8484-f7d7d8ca3324','blouza-oranaise-dentelle-cristaux','Blouza Oranaise en Dentelle Perle & Soie','بلوزة وهرانية بالدانتيل واللؤلؤ الحريري','Oran Blouza in Beaded Lace & Silk','Robe traditionnelle oranaise moderne en crêpe fluide avec bustier richement orné de perles fines et cristaux taillés. Fente discrète pour une démarche élégante.','فستان البلوزة الوهرانية الأنيقة بقماش الكريب الانسيابي مع صدرية مطرزة باللؤلؤ والكريستال اللامع.','Contemporary Oranese Blouza dress in fluid silk-crepe with exquisitely beaded lace neckline and waist accentuation.',26000,29500,'2093c166-a25d-4385-853c-4d74345326e6','ready_to_wear','Oran',14,0,0,1,1,'["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900","https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900"]',1793128173504,1793128173504);

INSERT INTO "Product" VALUES('7b93ebf3-3fc7-4374-9548-31b45bce8e1e','gandoura-constantinoise-fetla','Gandoura Constantinoise en Velours & Broderie Fetla','قندورة قسنطينية بالقطيفة وتطريز الفتلة','Constantine Velvet Gandoura with Fetla Embroidery','Gandoura impériale de Constantine en velours lourd grenat brodée à la main au fil d’or selon le motif paon et fleur de jasmin.','قندورة قسنطينية فخمة بالقطيفة الحرة وتطريز الفتلة الذهبية على الصدر والأكمام بنقوش تقليدية عريقة.','Aristocratic Constantine velvet gandoura featuring dense golden Fetla hand-embroidery along neckline, chest, and hem.',42000,NULL,'2093c166-a25d-4385-853c-4d74345326e6','made_to_order','Constantine',20,1,0,0,1,'["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900","https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900"]',1793128175604,1793128175604);

INSERT INTO "Product" VALUES('e896bcbb-0709-4446-aa23-b89b47c03445','jebba-kabyle-moderne-soie','Robe Kabyle Moderne en Soie & Passementerie','فستان قبائلي عصري بالحرير والتطريز الأمازيغي','Modern Kabyle Dress in Silk & Geometric Trimmings','Réinterprétation moderne de la Thaqendourth kabyle. Lignes épurées, rubans de zigzags traditionnels colorés et ceinture Fouta soyeuse assortie.','جبة قبائلية عصرية بتطريزات ألوان الهقار وجرجرة الزاهية مع حزام الفوطة التقليدي منسوج بحرفية عالية.','Contemporary reimagining of the Kabyle dress with silk base, vivid traditional zigzag lacework, and matching artisanal woven Fouta belt.',18500,NULL,'2093c166-a25d-4385-853c-4d74345326e6','ready_to_wear','Kabylie (Tizi Ouzou)',14,0,1,0,1,'["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900"]',1793128177272,1793128177272);

INSERT INTO "Product" VALUES('fcb77c6d-098f-47c6-8455-29a63c5f16b0','burnous-royal-laine-chaoui','Burnous Royal Homme en Pure Laine & Poil de Chameau','برنوس رجالي ملكي من الصوف الخالص ووبر الإبل','Royal Mens Burnous in Pure Wool & Camel Hair','Cape traditionnelle masculine emblématique d’Algérie. Tissé à la main dans les Aurès avec une laine vierge ultra-douce, capuchon travaillé et cordons torsadés.','برنوس شتوي رجالي أصيل منسوج يدوياً في الأوراس من صوف نقي ووبر الجمل مع قبعة مطرزة وأشرطة قطنية تقليدية.','Iconic Algerian heritage cape hand-loomed in the Aurès mountains using virgin wool and camel hair. Features artisanal cord fastenings.',36000,NULL,'7b1c03c1-a801-49ba-92d7-c37cfb6d29f1','ready_to_wear','Aurès / Batna',14,1,0,0,1,'["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900","https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900"]',1793128179036,1793128179036);

INSERT INTO "Product" VALUES('38538047-156e-44ee-80ae-b10cf0dd07de','burnous-mariee-ivoire-brode','Burnous de Mariée Blanc Ivoire en Cachemire Brodé','برنوس عروس أبيض عاجي بالكشمير والتطريز الذهبي','Bridal Ivory Burnous in Embroidered Cashmere','Cape de mariée solennelle en cachemire ivoire bordée d’une passementerie en fil d’or fin. Se porte élégamment sur le Karakou ou la robe blanche pour la sortie de noces.','برنوس العروسة الأبيض المطرز بالخيوط الذهبية الناعمة. لمسة الحشمة والأناقة المطلقة لخروج العروس في ليلة العمر.','Regal bridal cape in soft ivory cashmere bordered with fine golden passementerie, designed to drape gracefully over bridal ensembles.',29000,NULL,'a6c933c5-fe3e-48e7-bf24-5ec396131080','made_to_order','Alger',14,0,0,0,1,'["https://images.unsplash.com/photo-1544441893-675973e31985?w=900","https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900"]',1793128180674,1793128180674);

INSERT INTO "Product" VALUES('0eb0f0e7-0fa8-4e2c-aba6-858ca41ca503','gandoura-homme-ete-lin-ghardaia','Gandoura Homme Estivale en Pur Lin Saharien','قندورة رجالية صيفية من الكتان الصحراوي الصافي','Summer Mens Linen Gandoura from the Mzab','Gandoura légère et aérée confectionnée dans un lin naturel de haute qualité. Finitions au col et plastron brodé ton-sur-ton par les artisans du Mzab.','قندورة صيفية خفيفة من الكتان الفاخر ومطرزة بدقة عند الياقة والصدر. راحة وانتعاش مع إطلالة أنيقة للمسجد والزيارات العائلية.','Breathable and refined summer gandoura in premium natural linen, subtly detailed with tone-on-tone collar embroidery.',12500,NULL,'7b1c03c1-a801-49ba-92d7-c37cfb6d29f1','ready_to_wear','Ghardaïa (M’zab)',14,0,0,1,1,'["https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900"]',1793128181317,1793128181317);

INSERT INTO "Product" VALUES('932a2b5b-3bf4-412a-a7d0-42c54ec3b1af','badroune-algerois-crepe-soie','Badroune Algérois Contemporain en Crêpe de Soie','بدرون عاصمي معاصر من كريب الحرير','Contemporary Algiers Badroune in Silk Crepe','Combinaison-pantalon bouffant traditionnelle revisitée dans un style moderne minimaliste avec bustier brodé au fil d’argent.','البدرون العاصمي بقصة عصرية ناعمة تجمع بين أناقة السروال الشلقة والسترة المطرزة بخيوط الفضة النقية.','The traditional Algiers jumpsuit reinterpreted with minimalist sleek drape and fine silver needlework accents.',28000,NULL,'2093c166-a25d-4385-853c-4d74345326e6','ready_to_wear','Alger',14,0,1,0,1,'["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900","https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900"]',1793128183086,1793128183086);

INSERT INTO "Product" VALUES('4aad8548-7594-4c98-a0a4-42c222eeb34c','costume-trois-pieces-laine-peignee','Costume 3 Pièces en Laine Peignée d’Italie','بدلة رجالية 3 قطع من الصوف الإيطالي الفاخر','Three-Piece Suit in Italian Worsted Wool','Tailleur masculin trois pièces d’exception : veste deux boutons aux finitions tailleur manuelles, gilet ajusté et pantalon à plis. Idéal pour mariages et cérémonies formelles.','بدلة كلاسيكية فاخرة من ثلاث قطع: سترة أنيقة، صديرية مخصرة وسروال بتفصيل دقيق. الأناقة المثالية للأفراح واجتماعات العمل الرفيعة.','Artisanal three-piece sartorial suit: two-button tailored blazer, matching vest, and pleated trousers in fine worsted wool.',38500,44000,'48c24d48-642b-4c8f-a363-95f7a7b94c40','ready_to_wear',NULL,14,1,0,0,1,'["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900","https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900"]',1793128184506,1793128184506);

INSERT INTO "Product" VALUES('63ac24e9-dae6-426f-bab1-cf146c69d27e','blazer-destructure-lin-sable','Blazer Déstructuré en Pur Lin d’Été','سترة بليزر رجالية خفيفة من الكتان الرملي','Unstructured Summer Linen Blazer','Veste de costume déstructurée non doublée en lin respirant. Coupe contemporaine pour les journées chaudes d’Alger et d’Oran.','بليزر صيفي خفيف غير مبطن من الكتان الطبيعي. قصة عصرية مريحة تلائم الطقس المتوسطي الدافئ.','Unlined unstructured blazer tailored from premium breathable European flax. Effortless Mediterranean elegance.',19500,NULL,'c58d9ea1-bf6f-4dd8-9998-77dcdcba3d4c','ready_to_wear',NULL,14,0,1,0,1,'["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900","https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900"]',1793128186242,1793128186242);

INSERT INTO "Product" VALUES('52427ab2-de03-4f60-b211-e4449489ac44','chemise-oxford-coton-ajustee','Chemise Oxford en Coton d’Égypte','قميص أكسفورد من القطن المصري الصافي','Egyptian Cotton Oxford Button-Down Shirt','Indispensable du vestiaire masculin : tissu Oxford tissé serré en coton à fibres longues, col à pointes boutonnées et boutons en nacre.','قميص رجالي كلاسيكي لا غنى عنه من قماش أكسفورد المتين بالقطن المصري طويل التيلة مع أزرار صدفية متقنة.','Classic menswear staple crafted from heavyweight Egyptian long-staple cotton Oxford cloth with mother-of-pearl buttons.',7800,NULL,'7b1c03c1-a801-49ba-92d7-c37cfb6d29f1','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900","https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900"]',1793128188263,1793128188263);

INSERT INTO "Product" VALUES('528a8ac2-2542-4aaa-95db-22719567c578','pantalon-chino-coton-stretch','Pantalon Chino Ajusté en Gabardine Stretch','سروال شينو قطني بقصة مريحة وأنيقة','Slim-Fit Stretch Gabardine Chino Trousers','Chino en sergé de coton peigné avec une pointe d’élasthanne pour un confort incomparable tout au long de la journée.','سروال شينو قطني مرن ومريح للغاية مصمم للعمل والمشاوير اليومية بألوان راقية وجودة تدوم طويلاً.','Tailored chino pants woven from combed cotton twill with subtle stretch for effortless daily comfort.',6900,NULL,'c58d9ea1-bf6f-4dd8-9998-77dcdcba3d4c','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900","https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=900"]',1793128190751,1793128190751);

INSERT INTO "Product" VALUES('ff1d568a-b46b-46c3-bc53-be37b3fe6f89','veste-saharienne-coton-lourd','Veste Saharienne Inspirée du Sud Algérien','جاكيت صحراوي كلاسيكي مستوحى من الجنوب الجزائري','Saharienne Field Jacket in Heavy Canvas','Veste baroudeuse ceinturée à quatre poches plaquées, taillée dans une robuste toile de coton lavée. Hommage aux grands espaces du Sahara.','سترة صحراوية كلاسيكية بأربعة جيوب وحزام أنيق، مصنوعة من قماش قطني متين يحاكي سحر الصحراء الجزائرية الكبرى.','Four-pocket belted utility field jacket inspired by Algerian Saharan heritage, cut from washed durable cotton twill.',16500,19000,'7b1c03c1-a801-49ba-92d7-c37cfb6d29f1','ready_to_wear',NULL,14,0,0,1,1,'["https://images.unsplash.com/photo-1548883354-7622d03aca27?w=900","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900"]',1793128193063,1793128193063);

INSERT INTO "Product" VALUES('2ff93cc4-0b2e-4222-8810-e7073ad8d00e','trench-coat-minimaliste-ceinture','Trench Coat Minimaliste Imperméable','معطف ترنش كلاسيكي مضاد للمطر','Minimalist Weatherproof Belted Trench Coat','Lignes architecturales épurées, bavolet tempête subtil et gabardine imperméable traitée déperlante. L’élégance urbaine par excellence.','معطف ترينش أنيق بتصميم عصري ناعم وقماش مقاوم للأمطار مع حزام لتحديد الخصر وإطلالة راقية في الشتاء والربيع.','Double-breasted weatherproof gabardine trench coat featuring clean lines, removable belt, and signature storm flap.',24500,NULL,'48c24d48-642b-4c8f-a363-95f7a7b94c40','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900","https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900"]',1793128195009,1793128195009);

INSERT INTO "Product" VALUES('27e56879-4618-4299-8f75-8b3549b62c79','ensemble-tailleur-pantalon-crepe-ivoire','Ensemble Tailleur Pantalon en Crêpe Ivoire','طقم تايلور نسائي فاخر من كريب الحرير العاجي','Ivory Silk Crepe Pant Suit Ensemble','Veste de tailleur croisée à revers crantés associée à un pantalon large palazzo taille haute. Tombé lourd et fluide pour cérémonies et événements officiels.','طقم بدلة نسائية راقية باللون العاجي تتكون من سترة مخصرة وبنطال بقصة بالازو عريضة تمنحك إطلالة أميرية.','Double-breasted tailored blazer and wide-leg palazzo trousers in weighty fluid ivory crepe.',32000,37000,'48c24d48-642b-4c8f-a363-95f7a7b94c40','ready_to_wear',NULL,14,1,0,0,1,'["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900"]',1793128196414,1793128196414);

INSERT INTO "Product" VALUES('70fd66e1-5ae3-45dc-af91-663b2ca40267','robe-portefeuille-satinee-emeraude','Robe Portefeuille Satinée Vert Émeraude','فستان ساتان ملتف باللون الأخضر الزمردي','Emerald Satin Wrap Midi Dress','Robe midi portefeuille en satin soyeux et lumineux, nouée délicatement sur le côté. Manches blousantes aux poignets boutonnés.','فستان ميدي من الساتان الفاخر بقصة اللف الجانبية باللون الأخضر الزمردي الملكي مع أكمام فضفاضة وأسورة أنيقة.','Lustrous emerald satin wrap midi dress featuring balloon sleeves with buttoned cuffs and fluid movement.',15800,NULL,'b2cd394d-d198-4c64-8cc4-3aacf3536f11','ready_to_wear',NULL,14,0,0,1,1,'["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900","https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900"]',1793128198206,1793128198206);

INSERT INTO "Product" VALUES('110e7f9e-a9c0-4abd-bb09-973b6ff07333','blazer-oversize-laine-froide-camel','Blazer Oversize en Laine Froide Camel','بليزر أوفرسايز من الصوف الخفيف بلون الكاميل','Oversized Cool Wool Blazer in Camel','Coupe boyish structurée aux épaules affirmées, confectionné dans une laine vierge légère adaptée à toutes les saisons.','بليزر عصري واسع بأكتاف عريضة وقماش الصوف الخفيف المريح طوال العام لإطلالة تجمع بين الجرأة والرقي.','Architecturally structured oversized blazer with strong shoulders tailored in Italian cool wool.',21000,NULL,'b2cd394d-d198-4c64-8cc4-3aacf3536f11','ready_to_wear',NULL,14,0,1,0,1,'["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900","https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900"]',1793128200076,1793128200076);

INSERT INTO "Product" VALUES('7e6ee360-d809-4ad0-87f6-b794345bd2aa','chemisier-satin-de-soie-ivoire','Chemisier Fluide en Satin de Soie Ivoire','قميص حريري ناعم بلون العاج','Fluid Ivory Silk Satin Blouse','Chemisier au tombé caressant avec col lavallière amovible et poignets boutonnés de perles. Parfait sous un tailleur ou un Karakou déstructuré.','قميص نسائي ناعم من حرير الساتان الانسيابي مع ربطة عنق حريرية اختيارية وأزرار لؤلؤية رقيقة.','Sensual silk satin shirt with a removable pussy-bow necktie and refined pearlized button details.',11500,NULL,'b2cd394d-d198-4c64-8cc4-3aacf3536f11','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1551803091-e20673f15770?w=900","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900"]',1793128201873,1793128201873);

INSERT INTO "Product" VALUES('46a02d30-1e31-4bc0-ba21-7c7f4c6dcf4a','pantalon-palazzo-taille-haute-noir','Pantalon Palazzo Fluide Taille Haute','بنطال بالازو واسع بخصر عالي باللون الأسود','High-Waisted Fluid Palazzo Trousers','Coupe ample aérienne à plis plats qui allonge la silhouette. Matière crêpe infroissable idéale pour les journées actives.','بنطال نسائي واسع وأنيق بخصر مرتفع وقماش كريب مقاوم للتجعد يمنحك راحة وأناقة لا تضاهى طوال اليوم.','Wide-leg palazzo trousers with tailored front pleats that drape fluidly to elongate the silhouette.',8900,NULL,'b2cd394d-d198-4c64-8cc4-3aacf3536f11','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900","https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900"]',1793128203464,1793128203464);

INSERT INTO "Product" VALUES('199986c5-41b3-4bd9-8162-f0f1a933eb5a','parure-khit-er-rouh-doree-traditionnelle','Bijou de Tête Khit er Rouh Doré aux Émeraudes','حلي الرأس خيط الروح الجزائري التقليدي المذهب','Traditional Golden Khit er Rouh Headpiece','Le joyau emblématique de la mariée algéroise, orné de motifs en rosaces et gouttes serties de cristaux émeraude et perles baroques.','حلي خيط الروح العاصمي الأصيل لتزيين الجبين في الأعراس مع أحجار كريمة تحاكي الزمرد واللؤلؤ الحر.','The quintessential Algerian bridal tiara/choker featuring intricate filigree rosettes with emerald drop crystals.',14500,NULL,'257f2c10-724f-4c1e-852d-e0c59d6a9796','ready_to_wear','Alger (La Casbah)',14,1,0,0,1,'["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900","https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900"]',1793128205198,1793128205198);

INSERT INTO "Product" VALUES('2e749e23-b8cf-4b56-a583-a70dbf2edc85','ceinture-mdamma-orfevrerie-ciselee','Ceinture Traditionnelle Mdamma en Métal Ciselé','حزام المضمة التقليدي الذهبي المنقوش يدوياً','Hand-Engraved Traditional Mdamma Belt','Ceinture majestueuse articulée en métal doré ciselé à la main, rehaussée de cabochons et fermoir ornemental traditionnel.','حزام المضمة الفاخر المرصع بنقوش دقيقة وأحجار ملونة لإبراز خصر القفطان أو الكراكو التقليدي.','Articulated metallic golden belt with hand-chiselled arabesque filigree and jewel-toned cabochon settings.',12000,NULL,'257f2c10-724f-4c1e-852d-e0c59d6a9796','ready_to_wear','Tlemcen',14,0,0,0,1,'["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900","https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900"]',1793128206243,1793128206243);

INSERT INTO "Product" VALUES('6e084e16-1867-455d-95a4-091ddbedd51c','babouches-cuir-naturel-constantine','Babouches en Cuir Fait Main de Constantine','بلغة تقليدية من الجلد الطبيعي الأصيل بقسنطينة','Constantine Handcrafted Natural Leather Babouche','Chaussons traditionnels algériens en cuir d’agneau pleine fleur, semelle cousue main et bout légèrement pointu.','بلغة قسنطينية تقليدية من الجلد الطبيعي الطري، مريحة وخفيفة تليق بالبرنوس والقندورة الجزائرية.','Artisanal slippers hand-stitched from supple full-grain lambskin with durable natural leather soles.',6500,NULL,'257f2c10-724f-4c1e-852d-e0c59d6a9796','ready_to_wear','Constantine',14,0,0,0,1,'["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=900","https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900"]',1793128207034,1793128207034);

INSERT INTO "Product" VALUES('eaddeebd-e42c-47ec-b421-50591667df2e','hoodie-molleton-lourd-vert-foret','Sweat à Capuche en Molleton Épais 450g','هودي شتوي ثقيل من القطن العضوي باللون الأخضر الغابي','Heavyweight 450gsm Loopback Fleece Hoodie','Sweat à capuche au tombé lourd et volumineux, confectionné dans un molleton de coton peigné avec poche kangourou renforcée.','سويت شيرت بقبعة من القطن الثقيل الممتاز، دافئ ومريح بتصميم عصري ملائم لأيام الشتاء الباردة.','Premium 450gsm heavyweight cotton fleece hoodie featuring double-layered hood and ribbed side panels.',8500,NULL,'c58d9ea1-bf6f-4dd8-9998-77dcdcba3d4c','ready_to_wear',NULL,14,0,1,0,1,'["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900","https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=900"]',1793128208615,1793128208615);

INSERT INTO "Product" VALUES('c4271444-6d8e-4430-8f98-5d3a591c369d','jean-selvedge-coupe-droite-brut','Jean Brut Selvedge 14oz en Denim Pur Coton','جينز خام سيلفدج أصيل بقصة مستقيمة كلاسيكية','14oz Raw Selvedge Straight-Leg Denim Jeans','Denim non délavé tissé sur métiers à navette traditionnels avec liseré rouge selvedge aux coutures intérieures. Se patine magnifiquement avec le temps.','جينز دنيم خام أصلي غير مغسول بنسيج ياباني فائق المتانة وقصة مستقيمة تتكيف مع حركة جسمك وتزداد جمالاً مع الوقت.','Shuttle-loomed 14oz raw selvedge denim in deep indigo featuring clean signature selvedge edge inside the cuff.',11000,NULL,'c58d9ea1-bf6f-4dd8-9998-77dcdcba3d4c','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1542272604-780c96856592?w=900","https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900"]',1793128210208,1793128210208);

INSERT INTO "Product" VALUES('ca01c5c4-142f-4b11-8d94-edef8bc7d8e5','polo-maille-piquee-noir-solde','Polo en Maille Piquée Coton Égyptien','قميص بولو رجالي من القطن الناعم','Egyptian Cotton Piqué Polo Shirt','Polo élégant avec col chemise soigné et patte de boutonnage discrète. Maille piquée souple et fraîche.','قميص بولو ناعم وأنيق بقماش قطني بارد ومريح لأوقات العمل والنشاطات اليومية.','Refined knit polo tailored from airy Egyptian cotton piqué with a structured shirt collar.',4200,6500,'aea9ebbf-27c3-4000-b698-e8b2a4640528','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1625910513413-5bc50fcbb012?w=900","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900"]',1793128212112,1793128212112);

INSERT INTO "Product" VALUES('9abb755e-6bdc-45da-b183-423dd70bf54d','t-shirt-coton-lourd-blanc-solde','T-Shirt Minimaliste en Coton Bio 240g','تي شيرت قطني فاخر باللون الأبيض','Heavyweight 240gsm Organic Cotton T-Shirt','Le t-shirt blanc parfait : col côtelé dense indéformable, coupe droite impeccable et douceur naturelle.','تيشيرت أبيض أساسي عالي الجودة بنسيج قطني ثقيل وياقة محكمة لا تتغير مع الغسيل.','The definitive white t-shirt cut from heavy 240gsm combed organic cotton with a resilient ribbed collar.',2900,4200,'aea9ebbf-27c3-4000-b698-e8b2a4640528','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900"]',1793128213565,1793128213565);

INSERT INTO "Product" VALUES('34a83fc1-8ab2-4fcc-bc1b-eef257a57fa0','caftan-moderne-vert-emeraude-majboud','Caftan Moderne en Crêpe de Soie & Fil d’Or','قفطان عصري راقي بكريب الحرير والتطريز الذهبي','Modern Caftan in Emerald Silk Crepe & Gold Trimmings','Caftan revisité avec broderies royales aux manches et buste, boutons aqqad en soie dorée faits main et ceinture sfifa assortie.','قفطان جزائري أنيق يجمع بين القصة العصرية والتطريزات التقليدية مع أزرار العقد الحريرية المصنوعة يدوياً.','Reimagined contemporary caftan featuring ornate golden needlework, artisanal aqqad silk buttons, and coordinating belt.',34000,NULL,'2093c166-a25d-4385-853c-4d74345326e6','made_to_order','Tlemcen',15,0,0,1,1,'["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900","https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900"]',1793128214990,1793128214990);

INSERT INTO "Product" VALUES('a6e662ff-f33b-4cfa-9f06-49f04f786a69','melhfa-chaouie-traditionnelle-aures','Melhfa Chaouie Traditionnelle des Aurès','ملحفة شاوية أصيلة من جبال الأوراس','Authentic Chaoui Melhfa from the Aurès','Drapé ancestral des femmes chaouies en satin noir rehaussé de galons colorés brodés aux motifs géométriques berbères.','ملحفة شاوية أوراسية تقليدية مزدانة بشرائط تطريز أمازيغية متوارثة عبر الأجيال.','Ancestral Chaoui draped robe detailed with colorful Berber tribal geometric ribbon borders.',22000,NULL,'2093c166-a25d-4385-853c-4d74345326e6','ready_to_wear','Aurès / Batna',14,0,0,0,1,'["https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900","https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900"]',1793128216479,1793128216479);

INSERT INTO "Product" VALUES('2ff3b874-e1b1-4803-bd33-1c2aaf9c7814','robe-de-ceremonie-bustier-noir-profond','Robe de Cérémonie Bustier en Satin Duchesse','فستان سهرة ملكي من ساتان دوشيس الأسود','Duchess Satin Strapless Evening Gown','Robe de gala spectaculaire au bustier structuré façon haute couture et jupe sirène évasée. Présence captivante garantie.','فستان سهرة كلاسيكي بقصة الكورسيه المنحوتة وساتان دوشيس الفاخر الذي يمنحك تألقاً في أرقى الحفلات.','Sculptural strapless evening gown cut from structured Duchess satin with a subtle floor-skimming fishtail flare.',27500,NULL,'a6c933c5-fe3e-48e7-bf24-5ec396131080','ready_to_wear',NULL,14,1,0,0,1,'["https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=900","https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900"]',1793128217190,1793128217190);

INSERT INTO "Product" VALUES('0f692992-5cc5-46f6-9bb1-392dc78e8c7d','chemise-col-officier-lin-blanc','Chemise Col Officier en Pur Lin Lavé','قميص رجالي بياقة ماو من الكتان المغسول','Band Collar Pure Washed Linen Shirt','Allure épurée et contemporaine avec son col officier sans rabat et sa matière en lin respirant naturellement texturé.','قميص صيفي مريح بياقة دائرية مرتفعة وقماش كتان ناعم يناسب الإطلالات الكاجوال اليومية.','Relaxed band-collar shirt crafted from garment-washed European flax with natural cooling breathability.',8200,NULL,'c58d9ea1-bf6f-4dd8-9998-77dcdcba3d4c','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900","https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900"]',1793128219016,1793128219016);

INSERT INTO "Product" VALUES('a65ce025-2b35-4ebc-8e36-0031746b1285','manteau-long-laine-drap-charbon','Manteau Long Droit en Drap de Laine Charbon','معطف شتوي طويل من صوف الجوخ باللون الفحمي','Single-Breasted Long Overcoat in Charcoal Wool','Coupe droite épurée longueur genou, col tailleur cranté et fermeture trois boutons en corne. Chaleur protectrice et allure souveraine.','معطف شتوي طويل أنيق بصوف الجوخ الثقيل وأزرار متقنة تمنحك حماية من برد الشتاء ومظهراً فخماً.','Knee-length single-breasted wool overcoat featuring clean structured tailoring and horn buttons.',29500,NULL,'48c24d48-642b-4c8f-a363-95f7a7b94c40','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1544923246-77307dd654cb?w=900","https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900"]',1793128220410,1793128220410);

INSERT INTO "Product" VALUES('bfc7e23a-b1e4-43a4-86a9-e1f0f0a12978','jupe-midi-plissee-soleil-doree','Jupe Midi Plissée Soleil Métallisée','تنورة ميدي بكسرات الشمس اللامعة','Sunray Pleated Metallic Midi Skirt','Jupe plissée au tombé gracieux avec reflets dorés subtils et ceinture élastiquée confortable. Se porte aussi bien avec un pull doux qu’une chemise habillée.','تنورة بكسرات دقيقة منسدلة بلمعان ذهبي هادئ وحزام خصر مطاطي يجمع بين الراحة والأناقة.','Flowing sunray pleated midi skirt finished with a soft champagne metallic shimmer and comfortable waistband.',7900,NULL,'b2cd394d-d198-4c64-8cc4-3aacf3536f11','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900","https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900"]',1793128222178,1793128222178);

INSERT INTO "Product" VALUES('3992b62c-ba30-43a1-a2d4-5006f6cbf04d','cardigan-maille-cotelee-laine-merinos','Cardigan en Maille Côtelée Laine Mérinos Écru','سترة كارديغان صوفية ناعمة من صوف الميرينوس','Ribbed Merino Wool Cardigan in Ecru','Gilet boutonné moelleux en pure laine mérinos extra-fine. Boutons d’écaille végétale et emmanchures descendues pour un style cosy et chic.','كارديغان نسائي محبوك من صوف الميرينوس الخالص فائق النعومة والدفء بأزرار صدفية وتصميم عصري ناعم.','Cozy chunky cardigan knitted from extrafine merino wool yarns, complemented by tortoiseshell buttons.',11900,NULL,'c58d9ea1-bf6f-4dd8-9998-77dcdcba3d4c','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900"]',1793128223451,1793128223451);

INSERT INTO "Product" VALUES('23eae28a-52e4-40ea-8424-17ee958070ba','sac-cabas-cuir-graine-alger','Sac Cabas en Cuir Grainé Confectionné à Alger','حقيبة يد نسائية من الجلد الطبيعي المحبب صناعة العاصمة','Algiers Crafted Grained Leather Tote Bag','Cabas structuré en cuir bovin pleine fleur façonné dans nos ateliers maroquiniers d’Alger. Doublure en suédine douce et fermoir magnétique.','حقيبة تسوق يد وتكتف فخمة من الجلد البقري الطبيعي الأصيل المصنوع ببراعة في ورشاتنا بالعاصمة الجزائر.','Generous everyday tote bag crafted in Algiers from premium pebbled leather with reinforced shoulder handles.',18000,NULL,'257f2c10-724f-4c1e-852d-e0c59d6a9796','ready_to_wear','Alger',14,0,0,0,1,'["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900","https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900"]',1793128224724,1793128224724);

INSERT INTO "Product" VALUES('4dcbd04c-b999-4408-98f5-ff137d2182c2','echarpe-pashmina-cachemire-soie','Écharpe Pashmina en Cachemire & Soie','وشاح باشمينا فاخر من الكشمير والحرير','Cashmere & Silk Pashmina Shawl','Étole d’une douceur incomparable tissée avec un mélange soyeux de cachemire noble et de soie naturelle. Finitions franges torsadées à la main.','شال أنيق وناعم يلفك بالدفء والخفة مصنوع من أجود أنواع الكشمير والحرير مع شراشيب يدوية رقيقة.','Featherlight oversized pashmina shawl woven from noble Himalayan cashmere and Mulberry silk with hand-twisted fringes.',8500,NULL,'257f2c10-724f-4c1e-852d-e0c59d6a9796','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900","https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=900"]',1793128225805,1793128225805);

INSERT INTO "Product" VALUES('9d419a98-f304-48e4-96e2-c9f18a2368ca','robe-fluide-imprime-abstrait-solde','Robe Midi Fluide à Motif Minimaliste','فستان ميدي خفيف بنقشة تجريدية هادئة','Fluid Abstract Print Midi Dress','Robe légère ceinturée à encolure ronde et coupe dansante. Idéale pour les sorties décontractées.','فستان خفيف ومريح بألوان متناسقة وحزام لتحديد الخصر ملائم للمشاوير واللقاءات اليومية.','Breezy belted midi dress in a subtle abstract geometric print with keyhole back closure.',6500,9800,'aea9ebbf-27c3-4000-b698-e8b2a4640528','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900","https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900"]',1793128227312,1793128227312);

INSERT INTO "Product" VALUES('f31e2722-43a1-4c43-a47c-a7d4da536b79','blouson-bombardier-daim-tabac','Blouson Bombardier en Cuir Velours Tabac','جاكيت بومبر رجالي من جلد الغزال الفاخر بلون التبغ','Suede Leather Bomber Jacket in Tobacco Tan','Blouson d’inspiration aviateur en cuir suédé velouté avec col et poignets en bord-côte dense. Fermeture zippée en laiton vieilli.','جاكيت جلدي رجالي من السويد الناعم مع ياقة وأكمام مطاطية وسحاب معدني ذهبي عتيق يمنحك إطلالة شبابية راقية.','Vintage-inspired flight bomber jacket crafted from velvety goat suede leather with brass zip hardware.',32000,NULL,'7b1c03c1-a801-49ba-92d7-c37cfb6d29f1','ready_to_wear',NULL,14,0,1,0,1,'["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900","https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900"]',1793128228265,1793128228265);

INSERT INTO "Product" VALUES('3dc14203-a1ea-4c4c-85f6-8a2d85d0f573','seroual-chelka-soie-alger','Seroual Chelka Traditionnel en Soie Blanche','سروال شلقة عاصمي تقليدي من الحرير الأبيض','Algiers Silk Seroual Chelka Trousers','Pantalon bouffant fendu sur les côtés emblématique du costume d’Alger. Confectionné en satin de soie de Lyon avec boutons de passementerie.','سروال الشلقة العاصمي التقليدي بفتحاته الجانبية الشهيرة وأزرار القيطون المنسوجة يدوياً ليتكامل مع الكراكو.','Traditional Algiers split harem trousers in lustrous white silk satin with decorative passementerie buttons.',16500,NULL,'2093c166-a25d-4385-853c-4d74345326e6','ready_to_wear','Alger',14,0,0,0,1,'["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900","https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900"]',1793128229616,1793128229616);

INSERT INTO "Product" VALUES('ac53660c-cf8d-4490-a7f5-96351b14429e','cravate-soie-grenadine-bleu-nuit','Cravate en Soie Tissée Façon Grenadine','ربطة عنق من الحرير المنسوج باللون الكحلي','Handmade Silk Grenadine Tie in Midnight Navy','Cravate artisanale sept plis en soie grenadine à texture gaufrée noble. Fabriquée pour rehausser les costumes habillés.','ربطة عنق كلاسيكية فاخرة من الحرير الطبيعي المنسوج بنسيج محبب راق يضفي هيبة على بدلتك الرسمية.','Artisanal silk grenadine necktie with tactile woven honeycomb texture and untipped hand-rolled edges.',4900,NULL,'257f2c10-724f-4c1e-852d-e0c59d6a9796','ready_to_wear',NULL,14,0,0,0,1,'["https://images.unsplash.com/photo-1589756823695-278bc923f962?w=900","https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900"]',1793128231178,1793128231178);

INSERT INTO "Product" VALUES('2e903677-ebff-4dca-84da-5c7f26b79543','caftan-nuptial-soie-brode-or-alger','Caftan Nuptial en Satin de Soie & Plastron d’Or','قفطان العرس الأبيض المطرز بخيوط الذهب الخالص','Bridal White Silk Caftan with Gold Filigree Chest','Création d’apparat pour la mariée moderne : soierie blanche virginale ornée d’un plastron en broderie fil d’or Majboud et pierres fines.','تصميم ملكي لعرائس ماي ستايل: حرير أبيض ساحر مطرز بالمجبود الذهبي مع حزام مدمة متناسق.','Opulent bridal ceremonial caftan tailored in bridal silk satin featuring hand-threaded Majboud filigree breastplate.',56000,NULL,'a6c933c5-fe3e-48e7-bf24-5ec396131080','made_to_order','Alger',21,1,0,0,1,'["https://images.unsplash.com/photo-1544441893-675973e31985?w=900","https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900"]',1793128232111,1793128232111);

INSERT INTO "Product" VALUES('1912dc06-56c7-438e-b572-0a1989f04b1b','trench-long-fluide-kaki-ceinture','Trench-Coat Fluide Long en Tencel Ceinturé','معطف ترينش ناعم وطويل باللون الخاكي مع حزام','Fluid Tencel Long Trench Coat in Khaki','Trench féminin au drapé ultra-souple en fibres de tencel respirantes. Épaulettes amovibles et fente dos pour une allure résolument moderne.','معطف ترنش نسائي انسيابي طويل من ألياف التنسيل الناعمة، خفيف وأنيق مع حزام يبرز جمال القوام.','Flowing drape trench coat cut in breathable eco-tencel featuring deep storm flaps and storm welt pockets.',18900,NULL,'b2cd394d-d198-4c64-8cc4-3aacf3536f11','ready_to_wear',NULL,14,0,1,0,1,'["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900"]',1793128233165,1793128233165);

INSERT INTO "ProductVariant" VALUES('30d6b39c-d7c2-42d9-9322-572942293d5f','608f1e0c-d317-49c4-b018-d60fb2591eb9','Bordeaux Impérial','عنابي ملكي','Imperial Burgundy','#581825','38',3,'KAR-AL-BUR-38');

INSERT INTO "ProductVariant" VALUES('af3a664a-d708-4776-9ece-86ed2ff611aa','608f1e0c-d317-49c4-b018-d60fb2591eb9','Bordeaux Impérial','عنابي ملكي','Imperial Burgundy','#581825','40',4,'KAR-AL-BUR-40');

INSERT INTO "ProductVariant" VALUES('0f697cec-8225-4b18-b0c3-acb3d9f545e8','608f1e0c-d317-49c4-b018-d60fb2591eb9','Bordeaux Impérial','عنابي ملكي','Imperial Burgundy','#581825','42',2,'KAR-AL-BUR-42');

INSERT INTO "ProductVariant" VALUES('60e75e53-efb6-401d-80fd-aa17d4e2a552','608f1e0c-d317-49c4-b018-d60fb2591eb9','Vert Forêt Royal','أخضر ملكي','Royal Forest Green','#163323','38',2,'KAR-AL-GRN-38');

INSERT INTO "ProductVariant" VALUES('d62f97d2-fdf1-4af6-90b2-b5b9262f7193','608f1e0c-d317-49c4-b018-d60fb2591eb9','Vert Forêt Royal','أخضر ملكي','Royal Forest Green','#163323','40',3,'KAR-AL-GRN-40');

INSERT INTO "ProductVariant" VALUES('8c5b0c01-898d-4b57-8b3a-1b0c5cf78150','86ddcf25-0a6c-4025-8e4d-7974eb160607','Or & Rubis','ذهبي وياقوتي','Gold & Ruby','#C5A059','Standard',5,'CHD-TLM-GLD-STD');

INSERT INTO "ProductVariant" VALUES('d91b3d76-fd5f-4b08-82bd-f093ba48e7b6','86ddcf25-0a6c-4025-8e4d-7974eb160607','Or & Émeraude','ذهبي وزمردي','Gold & Emerald','#1B4D3E','Standard',3,'CHD-TLM-EMR-STD');

INSERT INTO "ProductVariant" VALUES('d9732b6e-17b5-4105-a46f-3c2371392be3','12c0aa53-d127-4d5d-8484-f7d7d8ca3324','Bleu Royal','أزرق ملكي','Royal Blue','#1D4ED8','38',4,'BLZ-ORN-BLU-38');

INSERT INTO "ProductVariant" VALUES('5495dd39-9993-43a9-bebe-981c110aceec','12c0aa53-d127-4d5d-8484-f7d7d8ca3324','Bleu Royal','أزرق ملكي','Royal Blue','#1D4ED8','40',3,'BLZ-ORN-BLU-40');

INSERT INTO "ProductVariant" VALUES('b27efb24-e5c0-43dc-b8ff-9699507aab67','12c0aa53-d127-4d5d-8484-f7d7d8ca3324','Bleu Royal','أزرق ملكي','Royal Blue','#1D4ED8','42',2,'BLZ-ORN-BLU-42');

INSERT INTO "ProductVariant" VALUES('08b02036-70a0-4194-b9e7-8b559bc0865a','12c0aa53-d127-4d5d-8484-f7d7d8ca3324','Rose Poudré','وردي ناعم','Dusty Rose','#E0B0B6','38',5,'BLZ-ORN-RS-38');

INSERT INTO "ProductVariant" VALUES('2990fb9b-0224-4333-b867-daf0ad9fffef','12c0aa53-d127-4d5d-8484-f7d7d8ca3324','Rose Poudré','وردي ناعم','Dusty Rose','#E0B0B6','40',2,'BLZ-ORN-RS-40');

INSERT INTO "ProductVariant" VALUES('a2c04644-b0cf-433c-a07d-8b26a03dc6ae','7b93ebf3-3fc7-4374-9548-31b45bce8e1e','Grenat Velours','عنابي مخملي','Garnet Velvet','#4A0E17','38',2,'GND-CST-GRN-38');

INSERT INTO "ProductVariant" VALUES('60fb8bcc-f0c4-463c-8283-3aac77265c16','7b93ebf3-3fc7-4374-9548-31b45bce8e1e','Grenat Velours','عنابي مخملي','Garnet Velvet','#4A0E17','40',3,'GND-CST-GRN-40');

INSERT INTO "ProductVariant" VALUES('ab95667d-ca3e-460b-a7e3-d493adcf0daf','7b93ebf3-3fc7-4374-9548-31b45bce8e1e','Noir Profond','أسود داكن','Deep Black','#111111','40',4,'GND-CST-BLK-40');

INSERT INTO "ProductVariant" VALUES('00c8702b-f23f-468e-aff7-5175eb0dec81','e896bcbb-0709-4446-aa23-b89b47c03445','Blanc Casbah','أبيض قصبة','Casbah White','#FAF9F6','38',4,'JBB-KAB-WHT-38');

INSERT INTO "ProductVariant" VALUES('cf6017c1-fa50-451f-843f-ec576a353f30','e896bcbb-0709-4446-aa23-b89b47c03445','Blanc Casbah','أبيض قصبة','Casbah White','#FAF9F6','40',8,'JBB-KAB-WHT-40');

INSERT INTO "ProductVariant" VALUES('5e3790e8-0da8-4ec1-8cb6-0ccd5e83b9e8','e896bcbb-0709-4446-aa23-b89b47c03445','Blanc Casbah','أبيض قصبة','Casbah White','#FAF9F6','42',4,'JBB-KAB-WHT-42');

INSERT INTO "ProductVariant" VALUES('a19de8d9-8b13-425e-b1c2-1e457dc056e1','e896bcbb-0709-4446-aa23-b89b47c03445','Jaune Safran','أصفر زعفراني','Saffron Yellow','#E5A93B','38',3,'JBB-KAB-YEL-38');

INSERT INTO "ProductVariant" VALUES('70fc2219-b525-4eb5-9f66-f521ebac020f','fcb77c6d-098f-47c6-8455-29a63c5f16b0','Brun Chameau','بني وبري','Camel Brown','#A06B43','L',5,'BRN-MEN-CAM-L');

INSERT INTO "ProductVariant" VALUES('af1ecf79-24d3-49ad-b65a-96e4156566c0','fcb77c6d-098f-47c6-8455-29a63c5f16b0','Brun Chameau','بني وبري','Camel Brown','#A06B43','XL',4,'BRN-MEN-CAM-XL');

INSERT INTO "ProductVariant" VALUES('52f2981e-b159-4c8a-9070-002164494b56','fcb77c6d-098f-47c6-8455-29a63c5f16b0','Blanc Écru','أبيض عاجي','Natural Ecru','#F5F5EC','L',6,'BRN-MEN-WHT-L');

INSERT INTO "ProductVariant" VALUES('239494f4-ddfe-42fc-9f3e-7146e6f96278','fcb77c6d-098f-47c6-8455-29a63c5f16b0','Blanc Écru','أبيض عاجي','Natural Ecru','#F5F5EC','XL',3,'BRN-MEN-WHT-XL');

INSERT INTO "ProductVariant" VALUES('6c80aaa2-eab1-4610-86db-e1028d212a73','38538047-156e-44ee-80ae-b10cf0dd07de','Blanc Ivoire','أبيض عاجي','Ivory White','#FAF0E6','Standard',6,'BRN-FEM-IVR-STD');

INSERT INTO "ProductVariant" VALUES('765e8b65-8c10-4880-bd8c-58127a2db8e1','0eb0f0e7-0fa8-4e2c-aba6-858ca41ca503','Blanc Cassé','أبيض مائل للبيج','Off-White','#F4F1EA','M',7,'GND-MEN-WHT-M');

INSERT INTO "ProductVariant" VALUES('5375332f-4227-40fb-ae62-21bdf11b7bee','0eb0f0e7-0fa8-4e2c-aba6-858ca41ca503','Blanc Cassé','أبيض مائل للبيج','Off-White','#F4F1EA','L',9,'GND-MEN-WHT-L');

INSERT INTO "ProductVariant" VALUES('20c5029c-ea31-4b52-8adb-631aea8b333d','0eb0f0e7-0fa8-4e2c-aba6-858ca41ca503','Blanc Cassé','أبيض مائل للبيج','Off-White','#F4F1EA','XL',5,'GND-MEN-WHT-XL');

INSERT INTO "ProductVariant" VALUES('6d21d697-b5b2-4cb8-86b6-2221ec8c182d','0eb0f0e7-0fa8-4e2c-aba6-858ca41ca503','Bleu Touareg','أزرق طوارقي','Tuareg Blue','#264653','L',4,'GND-MEN-BLU-L');

INSERT INTO "ProductVariant" VALUES('20b3d14b-6bd1-428c-b4ce-cb4f7500310e','932a2b5b-3bf4-412a-a7d0-42c54ec3b1af','Noir Minuit','أسود ليلي','Midnight Black','#121214','38',4,'BDR-AL-BLK-38');

INSERT INTO "ProductVariant" VALUES('28decd53-8927-4d90-bca5-44e646270535','932a2b5b-3bf4-412a-a7d0-42c54ec3b1af','Noir Minuit','أسود ليلي','Midnight Black','#121214','40',5,'BDR-AL-BLK-40');

INSERT INTO "ProductVariant" VALUES('4800b0d1-d1ca-47cb-942b-9e8fb1e9dc8b','932a2b5b-3bf4-412a-a7d0-42c54ec3b1af','Vert Olive Casbah','زيتي كلاسيكي','Casbah Olive','#556B2F','38',3,'BDR-AL-OLV-38');

INSERT INTO "ProductVariant" VALUES('ad25a1df-0b39-4736-99c2-963371690e2a','4aad8548-7594-4c98-a0a4-42c222eeb34c','Bleu Nuit','أزرق كحلي','Midnight Navy','#1E293B','48',3,'CST-MEN-NVY-48');

INSERT INTO "ProductVariant" VALUES('eba758eb-0d5e-4fb6-8460-b7f7f5ab1f56','4aad8548-7594-4c98-a0a4-42c222eeb34c','Bleu Nuit','أزرق كحلي','Midnight Navy','#1E293B','50',4,'CST-MEN-NVY-50');

INSERT INTO "ProductVariant" VALUES('817ea24d-6639-4a35-a3bc-adf53d99b229','4aad8548-7594-4c98-a0a4-42c222eeb34c','Bleu Nuit','أزرق كحلي','Midnight Navy','#1E293B','52',2,'CST-MEN-NVY-52');

INSERT INTO "ProductVariant" VALUES('9027d414-e4f0-46ec-a352-9f292dc734cf','4aad8548-7594-4c98-a0a4-42c222eeb34c','Gris Anthracite','رمادي فحمي','Charcoal Grey','#374151','50',3,'CST-MEN-GRY-50');

INSERT INTO "ProductVariant" VALUES('ee455bc0-445b-401a-bc88-193400810d10','63ac24e9-dae6-426f-bab1-cf146c69d27e','Sable Méditerranéen','رملي بيج','Sand','#D8C7B5','48',5,'BLZ-LIN-SND-48');

INSERT INTO "ProductVariant" VALUES('89762084-9078-4444-a343-6010a91d15e8','63ac24e9-dae6-426f-bab1-cf146c69d27e','Sable Méditerranéen','رملي بيج','Sand','#D8C7B5','50',6,'BLZ-LIN-SND-50');

INSERT INTO "ProductVariant" VALUES('d3617450-ba2c-4501-97af-756aa0691052','63ac24e9-dae6-426f-bab1-cf146c69d27e','Sable Méditerranéen','رملي بيج','Sand','#D8C7B5','52',3,'BLZ-LIN-SND-52');

INSERT INTO "ProductVariant" VALUES('42ee36f2-a577-41c9-9ed9-8d7090d093e6','63ac24e9-dae6-426f-bab1-cf146c69d27e','Bleu Ciel','أزرق سماوي','Sky Blue','#93C5FD','50',4,'BLZ-LIN-BLU-50');

INSERT INTO "ProductVariant" VALUES('e271941d-8d85-41f7-8294-7b0b03f41205','52427ab2-de03-4f60-b211-e4449489ac44','Blanc Pur','أبيض ناصع','Crisp White','#FFFFFF','S',6,'SHR-OXF-WHT-S');

INSERT INTO "ProductVariant" VALUES('8b5be432-b8f3-4863-8acd-37ab659d270f','52427ab2-de03-4f60-b211-e4449489ac44','Blanc Pur','أبيض ناصع','Crisp White','#FFFFFF','M',12,'SHR-OXF-WHT-M');

INSERT INTO "ProductVariant" VALUES('22fe883a-a086-4e40-944c-4cad8673ce16','52427ab2-de03-4f60-b211-e4449489ac44','Blanc Pur','أبيض ناصع','Crisp White','#FFFFFF','L',8,'SHR-OXF-WHT-L');

INSERT INTO "ProductVariant" VALUES('de7d1509-125b-4705-9007-0e230cfd0080','52427ab2-de03-4f60-b211-e4449489ac44','Blanc Pur','أبيض ناصع','Crisp White','#FFFFFF','XL',4,'SHR-OXF-WHT-XL');

INSERT INTO "ProductVariant" VALUES('9107ab43-db55-4df4-85dc-e0bb59619ec5','52427ab2-de03-4f60-b211-e4449489ac44','Bleu Ciel','أزرق فاتح','Light Blue','#BAE6FD','M',7,'SHR-OXF-BLU-M');

INSERT INTO "ProductVariant" VALUES('345594f3-2da6-4d0a-8d7a-d041921a54d7','52427ab2-de03-4f60-b211-e4449489ac44','Bleu Ciel','أزرق فاتح','Light Blue','#BAE6FD','L',5,'SHR-OXF-BLU-L');

INSERT INTO "ProductVariant" VALUES('fac69aa7-ab16-46cf-9068-bade5e3062bd','528a8ac2-2542-4aaa-95db-22719567c578','Beige Saharien','بيج صحراوي','Sahara Khaki','#C2B280','40',8,'CHN-MEN-BGE-40');

INSERT INTO "ProductVariant" VALUES('4a84d849-6637-4b5d-a52d-c8f97d81c827','528a8ac2-2542-4aaa-95db-22719567c578','Beige Saharien','بيج صحراوي','Sahara Khaki','#C2B280','42',10,'CHN-MEN-BGE-42');

INSERT INTO "ProductVariant" VALUES('d453ae1f-c5f2-41d9-8486-e34ab945c42a','528a8ac2-2542-4aaa-95db-22719567c578','Beige Saharien','بيج صحراوي','Sahara Khaki','#C2B280','44',5,'CHN-MEN-BGE-44');

INSERT INTO "ProductVariant" VALUES('71f21b3c-7a21-4180-95db-012e4174ece2','528a8ac2-2542-4aaa-95db-22719567c578','Bleu Marine','كحلي','Navy','#1E3A8A','42',7,'CHN-MEN-NVY-42');

INSERT INTO "ProductVariant" VALUES('6a0112b2-1882-4c05-b62b-19eb3485e817','528a8ac2-2542-4aaa-95db-22719567c578','Vert Olive','زيتي','Olive','#3F4F3B','42',6,'CHN-MEN-OLV-42');

INSERT INTO "ProductVariant" VALUES('a5ffafc9-1763-4c9d-8c5b-c3dc7fa10b12','ff1d568a-b46b-46c3-bc53-be37b3fe6f89','Kaki Désert','خاكي صحراوي','Desert Khaki','#8B856D','M',4,'SHR-JCK-KHK-M');

INSERT INTO "ProductVariant" VALUES('2b4c7cc6-7d68-491e-9a9f-808ab968058c','ff1d568a-b46b-46c3-bc53-be37b3fe6f89','Kaki Désert','خاكي صحراوي','Desert Khaki','#8B856D','L',6,'SHR-JCK-KHK-L');

INSERT INTO "ProductVariant" VALUES('22908985-98a0-45fb-b795-76f0fc7825ff','ff1d568a-b46b-46c3-bc53-be37b3fe6f89','Kaki Désert','خاكي صحراوي','Desert Khaki','#8B856D','XL',3,'SHR-JCK-KHK-XL');

INSERT INTO "ProductVariant" VALUES('f5b2db16-aac0-4fcd-b61d-3eeb1438e465','ff1d568a-b46b-46c3-bc53-be37b3fe6f89','Tabac Foncé','تبغي داكن','Dark Tobacco','#6F4E37','L',3,'SHR-JCK-TOB-L');

INSERT INTO "ProductVariant" VALUES('4bf0e0f3-8082-40d0-8bfb-97a32510aa8a','2ff93cc4-0b2e-4222-8810-e7073ad8d00e','Beige Mastic','بيج كلاسيكي','Mastic Beige','#D6CFC7','48',4,'TRN-MEN-BGE-48');

INSERT INTO "ProductVariant" VALUES('0e2d30af-4597-4fc5-a020-4e6425e0ab64','2ff93cc4-0b2e-4222-8810-e7073ad8d00e','Beige Mastic','بيج كلاسيكي','Mastic Beige','#D6CFC7','50',5,'TRN-MEN-BGE-50');

INSERT INTO "ProductVariant" VALUES('c28ecdc9-abf3-418b-b430-ee0c40568581','2ff93cc4-0b2e-4222-8810-e7073ad8d00e','Noir Carbone','أسود كربوني','Carbon Black','#1C1C1E','50',3,'TRN-MEN-BLK-50');

INSERT INTO "ProductVariant" VALUES('ef15d573-cdaf-47a4-9189-3d880f825a6d','27e56879-4618-4299-8f75-8b3549b62c79','Ivoire Nacré','عاجي لؤلؤي','Pearly Ivory','#FFFFF0','36',3,'TLR-FEM-IVR-36');

INSERT INTO "ProductVariant" VALUES('957476d5-0be7-450a-b463-e3ee79734fe0','27e56879-4618-4299-8f75-8b3549b62c79','Ivoire Nacré','عاجي لؤلؤي','Pearly Ivory','#FFFFF0','38',5,'TLR-FEM-IVR-38');

INSERT INTO "ProductVariant" VALUES('d9b800e4-9d2a-45fa-a357-d442591a76f3','27e56879-4618-4299-8f75-8b3549b62c79','Ivoire Nacré','عاجي لؤلؤي','Pearly Ivory','#FFFFF0','40',4,'TLR-FEM-IVR-40');

INSERT INTO "ProductVariant" VALUES('79931743-07d5-4c99-8000-8ab95d9960a3','27e56879-4618-4299-8f75-8b3549b62c79','Noir Smoking','أسود سموكينغ','Tuxedo Black','#0F0F10','38',4,'TLR-FEM-BLK-38');

INSERT INTO "ProductVariant" VALUES('21834c96-d0c0-454d-9556-1dada629113e','70fd66e1-5ae3-45dc-af91-663b2ca40267','Vert Émeraude','أخضر زمردي','Emerald Green','#046A38','38',5,'ROB-SAT-EMR-38');

INSERT INTO "ProductVariant" VALUES('cee5b1bb-cfc8-451a-af04-d1aa6dbeee4b','70fd66e1-5ae3-45dc-af91-663b2ca40267','Vert Émeraude','أخضر زمردي','Emerald Green','#046A38','40',6,'ROB-SAT-EMR-40');

INSERT INTO "ProductVariant" VALUES('0176df0d-63b9-4986-9560-fbff30886026','70fd66e1-5ae3-45dc-af91-663b2ca40267','Vert Émeraude','أخضر زمردي','Emerald Green','#046A38','42',3,'ROB-SAT-EMR-42');

INSERT INTO "ProductVariant" VALUES('eb26d427-da35-4167-aea1-c1232fcc0d12','70fd66e1-5ae3-45dc-af91-663b2ca40267','Rouge Grenat','أحمر قاني','Garnet Red','#7E191B','38',4,'ROB-SAT-RED-38');

INSERT INTO "ProductVariant" VALUES('53cd3f8f-c50e-4197-bca6-125b26666c35','110e7f9e-a9c0-4abd-bb09-973b6ff07333','Camel Chaud','كاميل دافئ','Warm Camel','#C19A6B','36',4,'BLZ-OVR-CML-36');

INSERT INTO "ProductVariant" VALUES('caed937c-adfb-4367-8734-17fcdfaffdf0','110e7f9e-a9c0-4abd-bb09-973b6ff07333','Camel Chaud','كاميل دافئ','Warm Camel','#C19A6B','38',7,'BLZ-OVR-CML-38');

INSERT INTO "ProductVariant" VALUES('ebbf34c7-05cb-49ad-b1b3-588988bd4f88','110e7f9e-a9c0-4abd-bb09-973b6ff07333','Camel Chaud','كاميل دافئ','Warm Camel','#C19A6B','40',4,'BLZ-OVR-CML-40');

INSERT INTO "ProductVariant" VALUES('0e6e7029-4c1b-4c3a-b2c8-07f812265bfa','110e7f9e-a9c0-4abd-bb09-973b6ff07333','Gris Cendré','رمادي رمادي','Ash Grey','#9CA3AF','38',3,'BLZ-OVR-GRY-38');

INSERT INTO "ProductVariant" VALUES('474194a0-3038-49d5-b727-743fd2a7de9c','7e6ee360-d809-4ad0-87f6-b794345bd2aa','Ivoire','عاجي','Ivory','#FFFFF2','38',6,'CHM-STN-IVR-38');

INSERT INTO "ProductVariant" VALUES('d41a0ff2-40be-4ad3-a33e-2c62f5662b8e','7e6ee360-d809-4ad0-87f6-b794345bd2aa','Ivoire','عاجي','Ivory','#FFFFF2','40',5,'CHM-STN-IVR-40');

INSERT INTO "ProductVariant" VALUES('7a43135a-f322-4e66-8c9a-562ec90dc06a','7e6ee360-d809-4ad0-87f6-b794345bd2aa','Ivoire','عاجي','Ivory','#FFFFF2','42',3,'CHM-STN-IVR-42');

INSERT INTO "ProductVariant" VALUES('2c730b2f-c3cb-4511-bea6-ba3e92f24e40','7e6ee360-d809-4ad0-87f6-b794345bd2aa','Champagne Doré','شامبانيا مذهب','Champagne Gold','#F7E7CE','38',4,'CHM-STN-CHM-38');

INSERT INTO "ProductVariant" VALUES('8e0d39da-6bb6-419d-b648-7808248e2417','46a02d30-1e31-4bc0-ba21-7c7f4c6dcf4a','Noir Profond','أسود داكن','Deep Black','#111111','36',5,'PLZ-FEM-BLK-36');

INSERT INTO "ProductVariant" VALUES('00651979-3006-4d31-96a7-ed65a46368ac','46a02d30-1e31-4bc0-ba21-7c7f4c6dcf4a','Noir Profond','أسود داكن','Deep Black','#111111','38',8,'PLZ-FEM-BLK-38');

INSERT INTO "ProductVariant" VALUES('4900df17-e029-494d-be69-0f78fd14f281','46a02d30-1e31-4bc0-ba21-7c7f4c6dcf4a','Noir Profond','أسود داكن','Deep Black','#111111','40',6,'PLZ-FEM-BLK-40');

INSERT INTO "ProductVariant" VALUES('30de63b5-7b48-4ab7-a888-8c3cb4bea94d','46a02d30-1e31-4bc0-ba21-7c7f4c6dcf4a','Blanc Crème','أبيض كريمي','Cream White','#FFFDD0','38',4,'PLZ-FEM-CRM-38');

INSERT INTO "ProductVariant" VALUES('b3ccfaed-2834-424f-8ecd-29502af82712','199986c5-41b3-4bd9-8162-f0f1a933eb5a','Doré & Vert Émeraude','مذهب وزمردي','Gold & Emerald','#C5A059','Standard',8,'ACC-KHR-GLD-STD');

INSERT INTO "ProductVariant" VALUES('ec944086-cbfe-43a0-8b52-08eba2e0e1ce','199986c5-41b3-4bd9-8162-f0f1a933eb5a','Doré & Rouge Rubis','مذهب وياقوتي','Gold & Ruby','#C5A059','Standard',5,'ACC-KHR-RUB-STD');

INSERT INTO "ProductVariant" VALUES('211b5f99-e3a2-417c-9886-fb9b466dc9b5','2e749e23-b8cf-4b56-a583-a70dbf2edc85','Doré Antique','ذهبي عتيق','Antique Gold','#D4AF37','Standard',10,'ACC-MDM-GLD-STD');

INSERT INTO "ProductVariant" VALUES('a6b82f27-bd73-4813-a7cb-5a8e5232a482','6e084e16-1867-455d-95a4-091ddbedd51c','Cuir Naturel Cognac','جلد كوجناك طبيعي','Cognac Leather','#9E5B32','41',4,'ACC-BAB-COG-41');

INSERT INTO "ProductVariant" VALUES('6b2cce25-47c9-42fe-b910-21f2dc35dccd','6e084e16-1867-455d-95a4-091ddbedd51c','Cuir Naturel Cognac','جلد كوجناك طبيعي','Cognac Leather','#9E5B32','42',6,'ACC-BAB-COG-42');

INSERT INTO "ProductVariant" VALUES('ecaeda48-418e-4f45-bd32-b6ed8e86c69c','6e084e16-1867-455d-95a4-091ddbedd51c','Cuir Naturel Cognac','جلد كوجناك طبيعي','Cognac Leather','#9E5B32','43',5,'ACC-BAB-COG-43');

INSERT INTO "ProductVariant" VALUES('e33ca4b7-659d-4731-b27a-f93f908891a1','6e084e16-1867-455d-95a4-091ddbedd51c','Jaune Saharien','أصفر صحراوي','Desert Yellow','#EAB308','42',3,'ACC-BAB-YEL-42');

INSERT INTO "ProductVariant" VALUES('1c7f6882-8690-4bfc-90c7-11eb450ede36','eaddeebd-e42c-47ec-b421-50591667df2e','Vert Forêt','أخضر غابي','Forest Green','#163323','M',8,'HOD-HVY-GRN-M');

INSERT INTO "ProductVariant" VALUES('529d525e-981d-466d-a043-43d900dcf1c6','eaddeebd-e42c-47ec-b421-50591667df2e','Vert Forêt','أخضر غابي','Forest Green','#163323','L',11,'HOD-HVY-GRN-L');

INSERT INTO "ProductVariant" VALUES('e8c8e89d-bd5f-43bc-a3f4-009615d1e115','eaddeebd-e42c-47ec-b421-50591667df2e','Vert Forêt','أخضر غابي','Forest Green','#163323','XL',5,'HOD-HVY-GRN-XL');

INSERT INTO "ProductVariant" VALUES('08d69282-12d0-4eeb-853e-218db512de46','eaddeebd-e42c-47ec-b421-50591667df2e','Noir Brut','أسود خام','Raw Black','#18181B','L',9,'HOD-HVY-BLK-L');

INSERT INTO "ProductVariant" VALUES('085ec78b-c724-4f83-88ed-e067e8e1eebf','c4271444-6d8e-4430-8f98-5d3a591c369d','Indigo Brut','نيلي خام','Raw Indigo','#1A2A40','30',4,'JEA-SLV-IND-30');

INSERT INTO "ProductVariant" VALUES('20c51d06-b278-4bf6-938a-02e888c9a7f6','c4271444-6d8e-4430-8f98-5d3a591c369d','Indigo Brut','نيلي خام','Raw Indigo','#1A2A40','32',8,'JEA-SLV-IND-32');

INSERT INTO "ProductVariant" VALUES('015c8fe3-cb80-4c78-97aa-dfebc4baba05','c4271444-6d8e-4430-8f98-5d3a591c369d','Indigo Brut','نيلي خام','Raw Indigo','#1A2A40','34',6,'JEA-SLV-IND-34');

INSERT INTO "ProductVariant" VALUES('2a6b38ad-edd9-4e8d-ba53-a786ca436f5b','c4271444-6d8e-4430-8f98-5d3a591c369d','Indigo Brut','نيلي خام','Raw Indigo','#1A2A40','36',3,'JEA-SLV-IND-36');

INSERT INTO "ProductVariant" VALUES('0fe2bacb-d961-4ce7-85fb-51557ab07672','ca01c5c4-142f-4b11-8d94-edef8bc7d8e5','Noir','أسود','Black','#111111','M',4,'POL-SL-BLK-M');

INSERT INTO "ProductVariant" VALUES('4dea0984-c6bc-44c5-ab88-b65c4e834c44','ca01c5c4-142f-4b11-8d94-edef8bc7d8e5','Noir','أسود','Black','#111111','L',3,'POL-SL-BLK-L');

INSERT INTO "ProductVariant" VALUES('d8f7d43f-0003-45a0-b4fd-748f2e7c7d78','ca01c5c4-142f-4b11-8d94-edef8bc7d8e5','Vert Forêt','أخضر','Forest','#163323','L',2,'POL-SL-GRN-L');

INSERT INTO "ProductVariant" VALUES('9b19bd71-9b17-4552-bd36-12592ee97eeb','9abb755e-6bdc-45da-b183-423dd70bf54d','Blanc Optique','أبيض ناصع','Bright White','#FFFFFF','S',5,'TSH-SL-WHT-S');

INSERT INTO "ProductVariant" VALUES('1e653939-7760-4d39-8bf3-b5e7eb8f56bc','9abb755e-6bdc-45da-b183-423dd70bf54d','Blanc Optique','أبيض ناصع','Bright White','#FFFFFF','M',8,'TSH-SL-WHT-M');

INSERT INTO "ProductVariant" VALUES('a03c4da9-4b93-4ecf-8431-131aad95e08e','9abb755e-6bdc-45da-b183-423dd70bf54d','Blanc Optique','أبيض ناصع','Bright White','#FFFFFF','L',6,'TSH-SL-WHT-L');

INSERT INTO "ProductVariant" VALUES('8e38b2ad-06cf-46fd-b24b-deec14364c18','34a83fc1-8ab2-4fcc-bc1b-eef257a57fa0','Vert Émeraude','أخضر زمردي','Emerald Green','#097969','38',3,'CFT-MOD-EMR-38');

INSERT INTO "ProductVariant" VALUES('07266fa8-c856-40fb-8fa0-a85f11368e18','34a83fc1-8ab2-4fcc-bc1b-eef257a57fa0','Vert Émeraude','أخضر زمردي','Emerald Green','#097969','40',4,'CFT-MOD-EMR-40');

INSERT INTO "ProductVariant" VALUES('349ef20e-c858-4f66-a0eb-e8dce7c644d5','34a83fc1-8ab2-4fcc-bc1b-eef257a57fa0','Bleu Pétrole','أزرق بترولي','Petroleum Blue','#005F73','40',3,'CFT-MOD-BLU-40');

INSERT INTO "ProductVariant" VALUES('43134183-efc7-43eb-8815-25b286e01478','a6e662ff-f33b-4cfa-9f06-49f04f786a69','Noir & Rouge Chaoui','أسود وأحمر شاوي','Black & Red Chaoui','#1C1917','Standard',5,'MLH-CHW-BLK-STD');

INSERT INTO "ProductVariant" VALUES('5de3561c-ad2a-434e-b469-2f5032975deb','2ff3b874-e1b1-4803-bd33-1c2aaf9c7814','Noir Ébène','أسود أبنوسي','Ebony Black','#0A0A0A','36',2,'ROB-CER-BLK-36');

INSERT INTO "ProductVariant" VALUES('da6e4ceb-1c38-4f04-925a-35f0b1655d5b','2ff3b874-e1b1-4803-bd33-1c2aaf9c7814','Noir Ébène','أسود أبنوسي','Ebony Black','#0A0A0A','38',4,'ROB-CER-BLK-38');

INSERT INTO "ProductVariant" VALUES('d3e10fee-96bf-46e5-9e59-533f0b36b409','2ff3b874-e1b1-4803-bd33-1c2aaf9c7814','Noir Ébène','أسود أبنوسي','Ebony Black','#0A0A0A','40',3,'ROB-CER-BLK-40');

INSERT INTO "ProductVariant" VALUES('1d5c1ada-81e2-44f0-ada9-0cf3d990dd30','2ff3b874-e1b1-4803-bd33-1c2aaf9c7814','Rouge Carmin','أحمر قرمزي','Crimson Red','#990000','38',3,'ROB-CER-RED-38');

INSERT INTO "ProductVariant" VALUES('30268048-c1a3-432a-b78a-a1e427725e64','0f692992-5cc5-46f6-9bb1-392dc78e8c7d','Blanc Pur','أبيض ناصع','Pure White','#FFFFFF','M',7,'CHM-MAO-WHT-M');

INSERT INTO "ProductVariant" VALUES('e4f28c56-6dbc-4fdc-b7a1-affa389db9fe','0f692992-5cc5-46f6-9bb1-392dc78e8c7d','Blanc Pur','أبيض ناصع','Pure White','#FFFFFF','L',9,'CHM-MAO-WHT-L');

INSERT INTO "ProductVariant" VALUES('0b0e28d2-7ffb-4fe3-adb1-d380886de630','0f692992-5cc5-46f6-9bb1-392dc78e8c7d','Bleu Indigo','أزرق نيلي','Indigo Blue','#1D3557','L',5,'CHM-MAO-IND-L');

INSERT INTO "ProductVariant" VALUES('749fdd4d-d3c1-49f6-a35a-de19668afd37','a65ce025-2b35-4ebc-8e36-0031746b1285','Gris Charbon','رمادي فحمي','Charcoal Grey','#2B2D42','48',3,'MNT-MEN-CHR-48');

INSERT INTO "ProductVariant" VALUES('85ca8e82-0845-4aeb-87f7-dc17c778549f','a65ce025-2b35-4ebc-8e36-0031746b1285','Gris Charbon','رمادي فحمي','Charcoal Grey','#2B2D42','50',4,'MNT-MEN-CHR-50');

INSERT INTO "ProductVariant" VALUES('730204bb-726b-45ea-bef2-7a3ec1c32e52','a65ce025-2b35-4ebc-8e36-0031746b1285','Gris Charbon','رمادي فحمي','Charcoal Grey','#2B2D42','52',2,'MNT-MEN-CHR-52');

INSERT INTO "ProductVariant" VALUES('aef7c98f-b017-4a12-9f50-4736d524d3bf','a65ce025-2b35-4ebc-8e36-0031746b1285','Noir Profond','أسود داكن','Deep Black','#111111','50',3,'MNT-MEN-BLK-50');

INSERT INTO "ProductVariant" VALUES('7945eb71-015e-4254-8d97-78b4f04f3fba','bfc7e23a-b1e4-43a4-86a9-e1f0f0a12978','Champagne Doré','شامبانيا مذهب','Golden Champagne','#E5C378','S',4,'JUP-PLS-GLD-S');

INSERT INTO "ProductVariant" VALUES('6746fbfa-7e6a-4104-b11f-646224899d88','bfc7e23a-b1e4-43a4-86a9-e1f0f0a12978','Champagne Doré','شامبانيا مذهب','Golden Champagne','#E5C378','M',7,'JUP-PLS-GLD-M');

INSERT INTO "ProductVariant" VALUES('3363a67f-629a-4b40-ba46-785489b5e42c','bfc7e23a-b1e4-43a4-86a9-e1f0f0a12978','Champagne Doré','شامبانيا مذهب','Golden Champagne','#E5C378','L',5,'JUP-PLS-GLD-L');

INSERT INTO "ProductVariant" VALUES('cd2d6241-2f89-4a6d-ab2c-3bfc217018c9','3992b62c-ba30-43a1-a2d4-5006f6cbf04d','Écru Naturel','سكري طبيعي','Natural Ecru','#FBF9F1','S',5,'CRD-MER-ECR-S');

INSERT INTO "ProductVariant" VALUES('acd7853b-32e4-416c-8868-554cb7cad526','3992b62c-ba30-43a1-a2d4-5006f6cbf04d','Écru Naturel','سكري طبيعي','Natural Ecru','#FBF9F1','M',6,'CRD-MER-ECR-M');

INSERT INTO "ProductVariant" VALUES('91d003bd-0a98-44c6-8611-901c91515d49','3992b62c-ba30-43a1-a2d4-5006f6cbf04d','Écru Naturel','سكري طبيعي','Natural Ecru','#FBF9F1','L',3,'CRD-MER-ECR-L');

INSERT INTO "ProductVariant" VALUES('b6dbe1e5-4450-45c6-97e9-03af1f51c725','23eae28a-52e4-40ea-8424-17ee958070ba','Noir Intense','أسود فاحم','Intense Black','#121212','Unique',7,'ACC-BAG-BLK-UNI');

INSERT INTO "ProductVariant" VALUES('938ed7b0-e261-4905-b176-b8cc9ca30623','23eae28a-52e4-40ea-8424-17ee958070ba','Camel Cuir','كاميل جلدي','Camel Tan','#B87333','Unique',5,'ACC-BAG-CML-UNI');

INSERT INTO "ProductVariant" VALUES('5d794d49-8072-45df-b500-cd272717fde4','4dcbd04c-b999-4408-98f5-ff137d2182c2','Vert Forêt','أخضر غابي','Forest Green','#163323','Unique',8,'ACC-PSH-GRN-UNI');

INSERT INTO "ProductVariant" VALUES('8eca14b9-6607-4faf-a10a-e79325fce969','4dcbd04c-b999-4408-98f5-ff137d2182c2','Bordeaux Profond','عنابي دافئ','Deep Burgundy','#6B1D2F','Unique',6,'ACC-PSH-BUR-UNI');

INSERT INTO "ProductVariant" VALUES('4fedaab4-093d-4bcb-9e7c-447b994a79c7','4dcbd04c-b999-4408-98f5-ff137d2182c2','Beige Sable','بيج رملي','Sand Beige','#D8C7B5','Unique',10,'ACC-PSH-BGE-UNI');

INSERT INTO "ProductVariant" VALUES('a4f4d46f-427e-47d5-ad81-b0aee9a8b163','9d419a98-f304-48e4-96e2-c9f18a2368ca','Noir & Crème','أسود وكريمي','Black & Cream','#222222','38',3,'ROB-SL-BC-38');

INSERT INTO "ProductVariant" VALUES('ea0a7d2c-7dd8-4d63-8ed4-4374eb31eb9c','9d419a98-f304-48e4-96e2-c9f18a2368ca','Noir & Crème','أسود وكريمي','Black & Cream','#222222','40',2,'ROB-SL-BC-40');

INSERT INTO "ProductVariant" VALUES('2d2b76e9-063d-4f13-b835-c8f3841a293c','f31e2722-43a1-4c43-a47c-a7d4da536b79','Tabac Doré','تبغي مذهب','Golden Tobacco','#A45A2A','M',3,'JCK-BMB-TOB-M');

INSERT INTO "ProductVariant" VALUES('13e2a92d-ce82-4605-84a8-4ce1654d3b53','f31e2722-43a1-4c43-a47c-a7d4da536b79','Tabac Doré','تبغي مذهب','Golden Tobacco','#A45A2A','L',5,'JCK-BMB-TOB-L');

INSERT INTO "ProductVariant" VALUES('c9b73801-e158-4fa8-9325-aa8bb401b035','f31e2722-43a1-4c43-a47c-a7d4da536b79','Tabac Doré','تبغي مذهب','Golden Tobacco','#A45A2A','XL',2,'JCK-BMB-TOB-XL');

INSERT INTO "ProductVariant" VALUES('28106941-3906-4058-b4cf-732833be29ff','3dc14203-a1ea-4c4c-85f6-8a2d85d0f573','Blanc Soie','أبيض حريري','Silk White','#FDFDFD','38',4,'SRW-CHL-WHT-38');

INSERT INTO "ProductVariant" VALUES('498ddf95-987b-4ce8-8381-71f969843371','3dc14203-a1ea-4c4c-85f6-8a2d85d0f573','Blanc Soie','أبيض حريري','Silk White','#FDFDFD','40',5,'SRW-CHL-WHT-40');

INSERT INTO "ProductVariant" VALUES('7dfeeb2b-9a11-4833-9df8-cb8bd6755f9d','3dc14203-a1ea-4c4c-85f6-8a2d85d0f573','Or Vénitien','ذهبي فينيسي','Venetian Gold','#E5C378','40',3,'SRW-CHL-GLD-40');

INSERT INTO "ProductVariant" VALUES('c3156914-e2da-43b3-a443-56b11da3a44c','ac53660c-cf8d-4490-a7f5-96351b14429e','Bleu Nuit','كحلي ليلي','Midnight Navy','#1E293B','Standard',12,'ACC-TIE-NVY-STD');

INSERT INTO "ProductVariant" VALUES('a0d9a172-f9e1-4116-aa44-a725bd4f2848','ac53660c-cf8d-4490-a7f5-96351b14429e','Bordeaux Royal','عنابي ملكي','Royal Burgundy','#661424','Standard',8,'ACC-TIE-BUR-STD');

INSERT INTO "ProductVariant" VALUES('2ca8432a-07bf-4903-9815-9e26b7adb4ee','2e903677-ebff-4dca-84da-5c7f26b79543','Blanc Nuptial','أبيض عرائسي','Bridal White','#FFFFFF','38',3,'CFT-NUP-WHT-38');

INSERT INTO "ProductVariant" VALUES('0610b3f3-4c7d-474d-851a-5f0ba445bcaa','2e903677-ebff-4dca-84da-5c7f26b79543','Blanc Nuptial','أبيض عرائسي','Bridal White','#FFFFFF','40',4,'CFT-NUP-WHT-40');

INSERT INTO "ProductVariant" VALUES('a95cbf42-58dd-4929-a467-ff971c86a725','1912dc06-56c7-438e-b572-0a1989f04b1b','Kaki Sauge','خاكي مائل للرمادي','Sage Khaki','#77815C','38',4,'TRN-FEM-KHK-38');

INSERT INTO "ProductVariant" VALUES('4f198bbd-c9c1-49b4-83d2-475802bec9ba','1912dc06-56c7-438e-b572-0a1989f04b1b','Kaki Sauge','خاكي مائل للرمادي','Sage Khaki','#77815C','40',5,'TRN-FEM-KHK-40');

INSERT INTO "ProductVariant" VALUES('b657a93c-f486-47f3-86b5-2a40dcc310d6','1912dc06-56c7-438e-b572-0a1989f04b1b','Noir Minuit','أسود ليلي','Midnight Black','#141416','38',4,'TRN-FEM-BLK-38');

INSERT INTO "TailoringRequest" VALUES('3a11dbf6-ad14-47a2-bd2c-4cc752925046','e4b30ecb-0f96-4bb7-bb14-d750c5797789','Leila Mansouri','client@mystyle.dz','0555778899','608f1e0c-d317-49c4-b018-d60fb2591eb9','Karakou Algérois Royal en Velours & Majboud','{"bust":92,"waist":74,"hips":98,"height":168,"shoulder":40,"sleeve":60}','Sur-mesure','Bordeaux Impérial','Majboud Royal Haute Tradition','Velours de Gênes de Soie','Pour mon mariage prévu le 15 août. Souhaite des finitions fil d’or antique.','2026-08-01','quote_sent',52000,18,'Devis préparé par Maître Amine avec 2 essayages prévus à Alger.',1793128235477,1793128235477);

INSERT INTO "TailoringRequest" VALUES('aeda7179-cfa7-4b98-94e6-b057b2b49169','e4b30ecb-0f96-4bb7-bb14-d750c5797789','Amina Cherif','amina.c@gmail.com','0662334455','86ddcf25-0a6c-4025-8e4d-7974eb160607','Chedda Tlemcenia Impériale Haute Couture',NULL,'40','Or & Rubis','Fetla & Majboud avec Perles Fines',NULL,'Chedda pour fiançailles traditionnelles à Tlemcen.','2026-09-10','in_production',75000,25,'Acompte reçu. Découpe des velours et perlage en cours.',1793128235829,1793128235829);

INSERT INTO "User" VALUES('a5eb1501-df87-49ba-92ad-df14562d09c2','admin@mystyle.dz','$2b$10$OcMRcEXSJQZcR.fUKvCNyO5lydwBAh68TZ57OJnqq54qnx6ZsmdWi','Yacine Rahmani (Directeur)','0550123456','admin',1793128166424,1793128166424);

INSERT INTO "User" VALUES('258a49e9-0018-43b0-99b6-c19ce01c8a90','tailor@mystyle.dz','$2b$10$w1khgv2RPlKtex4VDY9isO82bX8quQc1LqBxkYaOqFpC8GTORNbdC','Maître Amine - Atelier Casbah','0661987654','tailor',1793128166832,1793128166832);

INSERT INTO "User" VALUES('aa74bf87-3b64-4a88-830c-fc571346c50a','staff@mystyle.dz','$2b$10$1/QD4QnIrvpkFzgzkg4rS.NVYP1AFTLC88iuQ0o4676BHOxEiE2PO','Nadia Benali (Service Client)','0770554433','staff',1793128167295,1793128167295);

INSERT INTO "User" VALUES('e4b30ecb-0f96-4bb7-bb14-d750c5797789','client@mystyle.dz','$2b$10$yf0Fx5sBLE8Xlu/GmKWYnu/KPdWa7q1Yu7kHs929EBSwoIz236hwa','Leila Mansouri','0555778899','customer',1793128167725,1793128167725);

INSERT INTO "Wilaya" VALUES(1,'Adrar','أدرار',1200,750,1);

INSERT INTO "Wilaya" VALUES(2,'Chlef','الشلف',750,450,1);

INSERT INTO "Wilaya" VALUES(3,'Laghouat','الأغواط',950,550,1);

INSERT INTO "Wilaya" VALUES(4,'Oum El Bouaghi','أم البواقي',800,450,1);

INSERT INTO "Wilaya" VALUES(5,'Batna','باتنة',800,450,1);

INSERT INTO "Wilaya" VALUES(6,'Béjaïa','بجاية',750,450,1);

INSERT INTO "Wilaya" VALUES(7,'Biskra','بسكرة',900,500,1);

INSERT INTO "Wilaya" VALUES(8,'Béchar','بشار',1200,700,1);

INSERT INTO "Wilaya" VALUES(9,'Blida','البليدة',600,350,1);

INSERT INTO "Wilaya" VALUES(10,'Bouira','البويرة',700,400,1);

INSERT INTO "Wilaya" VALUES(11,'Tamanrasset','تمنراست',1500,900,1);

INSERT INTO "Wilaya" VALUES(12,'Tébessa','تبسة',850,500,1);

INSERT INTO "Wilaya" VALUES(13,'Tlemcen','تلمسان',800,450,1);

INSERT INTO "Wilaya" VALUES(14,'Tiaret','تيارت',800,450,1);

INSERT INTO "Wilaya" VALUES(15,'Tizi Ouzou','تيزي وزو',700,400,1);

INSERT INTO "Wilaya" VALUES(16,'Alger','الجزائر العاصمة',500,300,1);

INSERT INTO "Wilaya" VALUES(17,'Djelfa','الجلفة',850,500,1);

INSERT INTO "Wilaya" VALUES(18,'Jijel','جيجل',800,450,1);

INSERT INTO "Wilaya" VALUES(19,'Sétif','سطيف',750,450,1);

INSERT INTO "Wilaya" VALUES(20,'Saïda','سعيدة',850,500,1);

INSERT INTO "Wilaya" VALUES(21,'Skikda','سكيكدة',800,450,1);

INSERT INTO "Wilaya" VALUES(22,'Sidi Bel Abbès','سيدي بلعباس',800,450,1);

INSERT INTO "Wilaya" VALUES(23,'Annaba','عنابة',800,450,1);

INSERT INTO "Wilaya" VALUES(24,'Guelma','قالمة',800,450,1);

INSERT INTO "Wilaya" VALUES(25,'Constantine','قسنطينة',750,450,1);

INSERT INTO "Wilaya" VALUES(26,'Médéa','المدية',700,400,1);

INSERT INTO "Wilaya" VALUES(27,'Mostaganem','مستغانم',750,450,1);

INSERT INTO "Wilaya" VALUES(28,'M''Sila','المسيلة',850,500,1);

INSERT INTO "Wilaya" VALUES(29,'Mascara','معسكر',800,450,1);

INSERT INTO "Wilaya" VALUES(30,'Ouargla','ورقلة',1100,650,1);

INSERT INTO "Wilaya" VALUES(31,'Oran','وهران',750,400,1);

INSERT INTO "Wilaya" VALUES(32,'El Bayadh','البيض',1000,600,1);

INSERT INTO "Wilaya" VALUES(33,'Illizi','إليزي',1500,950,1);

INSERT INTO "Wilaya" VALUES(34,'Bordj Bou Arreridj','برج بوعريريج',750,450,1);

INSERT INTO "Wilaya" VALUES(35,'Boumerdès','بومرداس',600,350,1);

INSERT INTO "Wilaya" VALUES(36,'El Tarf','الطارف',850,500,1);

INSERT INTO "Wilaya" VALUES(37,'Tindouf','تندوف',1500,950,1);

INSERT INTO "Wilaya" VALUES(38,'Tissemsilt','تيسمسيلت',800,450,1);

INSERT INTO "Wilaya" VALUES(39,'El Oued','الوادي',1000,600,1);

INSERT INTO "Wilaya" VALUES(40,'Khenchela','خنشلة',850,500,1);

INSERT INTO "Wilaya" VALUES(41,'Souk Ahras','سوق أهراس',850,500,1);

INSERT INTO "Wilaya" VALUES(42,'Tipaza','تيبازة',600,350,1);

INSERT INTO "Wilaya" VALUES(43,'Mila','ميلة',800,450,1);

INSERT INTO "Wilaya" VALUES(44,'Aïn Defla','عين الدفلى',700,400,1);

INSERT INTO "Wilaya" VALUES(45,'Naâma','النعامة',1100,650,1);

INSERT INTO "Wilaya" VALUES(46,'Aïn Témouchent','عين تموشنت',800,450,1);

INSERT INTO "Wilaya" VALUES(47,'Ghardaïa','غرداية',1000,600,1);

INSERT INTO "Wilaya" VALUES(48,'Relizane','غليزان',800,450,1);

INSERT INTO "Wilaya" VALUES(49,'El M''Ghair','المغير',1000,600,1);

INSERT INTO "Wilaya" VALUES(50,'El Menia','المنيعة',1100,650,1);

INSERT INTO "Wilaya" VALUES(51,'Ouled Djellal','أولاد جلال',950,550,1);

INSERT INTO "Wilaya" VALUES(52,'Bordj Baji Mokhtar','برج باجي مختار',1600,1000,1);

INSERT INTO "Wilaya" VALUES(53,'Béni Abbès','بني عباس',1250,750,1);

INSERT INTO "Wilaya" VALUES(54,'Timimoun','تيميمون',1250,750,1);

INSERT INTO "Wilaya" VALUES(55,'Touggourt','تقرت',1050,600,1);

INSERT INTO "Wilaya" VALUES(56,'Djanet','جانت',1600,1000,1);

INSERT INTO "Wilaya" VALUES(57,'In Salah','عين صالح',1350,800,1);

INSERT INTO "Wilaya" VALUES(58,'In Guezzam','عين قزام',1600,1000,1);

PRAGMA foreign_keys = ON;
