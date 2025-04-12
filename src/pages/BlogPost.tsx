
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Calendar, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // This would normally come from an API or database
  const blogPosts = {
    "crypto-investment-basics": {
      id: 1,
      title: "أساسيات الاستثمار في العملات المشفرة للمبتدئين",
      date: "١٢ أبريل ٢٠٢٥",
      category: "أساسيات",
      image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      content: `
        <p className="mb-4">مرحبًا بك في عالم العملات المشفرة! يعد الاستثمار في العملات الرقمية من أكثر المجالات إثارة في عصرنا الحالي، لكنه يأتي مع تحديات ومخاطر يجب أن تكون على دراية بها.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">فهم أساسيات العملات المشفرة</h2>
        <p className="mb-4">قبل البدء في رحلة الاستثمار، من المهم فهم ما هي العملات المشفرة. باختصار، العملات المشفرة هي أصول رقمية تستخدم التشفير لتأمين معاملاتها وللتحكم في إنشاء وحدات جديدة. تعمل معظم العملات المشفرة على تقنية تسمى البلوكتشين، وهي سجل موزع ولا مركزي للمعاملات.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">اختيار منصة التداول المناسبة</h2>
        <p className="mb-4">تعد اختيار منصة التداول المناسبة من أولى الخطوات المهمة في رحلة الاستثمار. هناك العديد من المنصات المتاحة، مثل بينانس، وكوين بيس، وكراكن، ولكل منها مزايا وعيوب. عند اختيار منصة، انتبه إلى عوامل مثل الرسوم، والأمان، وتنوع العملات المتاحة، وسهولة الاستخدام.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">إنشاء محفظة آمنة</h2>
        <p className="mb-4">بعد اختيار منصة التداول، ستحتاج إلى إنشاء محفظة لتخزين عملاتك المشفرة. هناك أنواع مختلفة من المحافظ: محافظ الويب، ومحافظ الهاتف المحمول، ومحافظ الأجهزة، ومحافظ الورق. لحماية استثماراتك، فكر في استخدام محفظة أجهزة مثل Ledger أو Trezor للتخزين طويل المدى.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">استراتيجيات الاستثمار الأساسية</h2>
        <p className="mb-4">هناك عدة استراتيجيات يمكن اتباعها عند الاستثمار في العملات المشفرة:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>الشراء والاحتفاظ (HODL):</strong> وهي استراتيجية تتضمن شراء العملات المشفرة والاحتفاظ بها لفترة طويلة، على أمل أن ترتفع قيمتها مع مرور الوقت.</li>
          <li><strong>التداول اليومي:</strong> يتضمن شراء وبيع العملات المشفرة خلال يوم واحد، للاستفادة من تقلبات السوق قصيرة المدى.</li>
          <li><strong>متوسط تكلفة الدولار (DCA):</strong> تتضمن استثمار مبلغ ثابت من المال في عملة مشفرة معينة على فترات منتظمة، بغض النظر عن سعرها.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">إدارة المخاطر</h2>
        <p className="mb-4">الاستثمار في العملات المشفرة ينطوي على مخاطر كبيرة. لحماية نفسك، اتبع هذه النصائح:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>لا تستثمر أكثر مما يمكنك تحمل خسارته.</li>
          <li>نوع محفظتك الاستثمارية عبر مختلف العملات المشفرة والأصول التقليدية.</li>
          <li>قم بإجراء بحث شامل قبل الاستثمار في أي عملة مشفرة.</li>
          <li>كن حذرًا من مخططات الاحتيال والوعود بعوائد غير واقعية.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">البقاء على اطلاع</h2>
        <p className="mb-4">يتغير سوق العملات المشفرة بسرعة. ابق على اطلاع بأحدث الأخبار والتطورات من خلال متابعة المصادر الموثوقة، وانضم إلى مجتمعات العملات المشفرة على منصات مثل Reddit وTwitter.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">الخلاصة</h2>
        <p className="mb-4">الاستثمار في العملات المشفرة يمكن أن يكون مغامرة مثيرة ومربحة، ولكنه يتطلب التعليم المستمر والصبر والحذر. ابدأ بمبالغ صغيرة، وتعلم باستمرار، واستخدم استراتيجيات إدارة المخاطر المناسبة. مع الوقت والخبرة، يمكنك بناء محفظة استثمارية ناجحة في العملات المشفرة.</p>
      `
    },
    "blockchain-impact-arabic-finance": {
      id: 2,
      title: "كيف تؤثر تقنية البلوكتشين على القطاع المالي في العالم العربي؟",
      date: "٨ أبريل ٢٠٢٥",
      category: "تكنولوجيا",
      image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      content: `
        <p className="mb-4">شهد العالم العربي في السنوات الأخيرة تحولًا كبيرًا نحو الرقمنة في القطاع المالي، وتلعب تقنية البلوكتشين دورًا محوريًا في هذا التحول.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">ما هي تقنية البلوكتشين؟</h2>
        <p className="mb-4">البلوكتشين هي تقنية دفتر الأستاذ الموزع (DLT) التي تسمح بتسجيل المعاملات وتتبع الأصول في شبكة الأعمال. يمكن أن يكون الأصل ملموسًا (كالعقار) أو غير ملموس (كالملكية الفكرية). يمكن تتبع وتداول أي شيء ذي قيمة على شبكة البلوكتشين، مما يقلل المخاطر ويوفر التكاليف للجميع.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">تأثير البلوكتشين على القطاع المصرفي العربي</h2>
        <p className="mb-4">تتبنى البنوك في العالم العربي تقنية البلوكتشين بشكل متزايد لتحسين كفاءة عملياتها. فعلى سبيل المثال:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>تحويلات مالية أسرع وأقل تكلفة:</strong> تسمح تقنية البلوكتشين بإجراء التحويلات المالية عبر الحدود في دقائق بدلاً من أيام، وبتكلفة أقل بكثير من الطرق التقليدية.</li>
          <li><strong>تمويل التجارة:</strong> يمكن استخدام العقود الذكية لأتمتة عمليات تمويل التجارة، مما يقلل من الأعمال الورقية ويسرع العمليات.</li>
          <li><strong>مكافحة غسل الأموال:</strong> توفر تقنية البلوكتشين سجلاً دائمًا وغير قابل للتغيير للمعاملات، مما يساعد في تتبع ومنع الأنشطة المالية غير المشروعة.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">تطبيقات البلوكتشين في التمويل الإسلامي</h2>
        <p className="mb-4">يشهد قطاع التمويل الإسلامي اهتمامًا متزايدًا بتقنية البلوكتشين:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>الصكوك:</strong> يمكن إصدار وتداول الصكوك (السندات الإسلامية) باستخدام البلوكتشين، مما يزيد من الشفافية ويقلل التكاليف.</li>
          <li><strong>التكافل:</strong> يمكن استخدام العقود الذكية لأتمتة عمليات التأمين التكافلي، مما يزيد من الكفاءة والشفافية.</li>
          <li><strong>الزكاة:</strong> يمكن استخدام البلوكتشين لتتبع جمع وتوزيع أموال الزكاة، مما يضمن الشفافية والكفاءة.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">تحديات تبني تقنية البلوكتشين في العالم العربي</h2>
        <p className="mb-4">رغم الإمكانات الكبيرة، تواجه تقنية البلوكتشين عدة تحديات في المنطقة العربية:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>اللوائح التنظيمية:</strong> هناك حاجة إلى إطار تنظيمي واضح للتقنيات المالية الجديدة.</li>
          <li><strong>الوعي والتعليم:</strong> هناك حاجة إلى زيادة الوعي وتوفير التعليم حول تقنية البلوكتشين وفوائدها.</li>
          <li><strong>البنية التحتية:</strong> تتطلب تقنية البلوكتشين بنية تحتية رقمية متطورة، وهي غير متوفرة بشكل كامل في بعض الدول العربية.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">مبادرات البلوكتشين في العالم العربي</h2>
        <p className="mb-4">هناك العديد من المبادرات الرائدة في المنطقة:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>استراتيجية دبي للبلوكتشين:</strong> تهدف إلى جعل دبي أول مدينة في العالم تدار كاملًا بواسطة البلوكتشين بحلول عام 2030.</li>
          <li><strong>سوق أبوظبي العالمي:</strong> أطلق العديد من المبادرات لدعم تطوير تقنية البلوكتشين في القطاع المالي.</li>
          <li><strong>رؤية السعودية 2030:</strong> تضمنت الاستثمار في التقنيات الناشئة، بما في ذلك البلوكتشين.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">الخلاصة</h2>
        <p className="mb-4">تقنية البلوكتشين لديها القدرة على إحداث تحول جذري في القطاع المالي في العالم العربي، وخاصة في مجالات التحويلات المالية، والتمويل الإسلامي، والشمول المالي. ومع تطور اللوائح التنظيمية والبنية التحتية، من المتوقع أن يزداد تبني هذه التقنية في السنوات القادمة، مما سيؤدي إلى نظام مالي أكثر كفاءة وشمولاً وشفافية.</p>
      `
    },
    "nft-investment-guide": {
      id: 3,
      title: "دليلك الشامل للـ NFTs وكيفية الاستثمار فيها",
      date: "١ أبريل ٢٠٢٥",
      category: "استثمار",
      image: "https://images.unsplash.com/photo-1646634685252-8db8a56f08b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      content: `
        <p className="mb-4">أصبحت الرموز غير القابلة للاستبدال (NFTs) ظاهرة عالمية، جذبت اهتمام الفنانين والمستثمرين والمشاهير. في هذا الدليل الشامل، سنتعرف على ماهية الـ NFTs وكيفية الاستثمار فيها.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">ما هي الـ NFTs؟</h2>
        <p className="mb-4">الـ NFTs هي رموز رقمية فريدة تمثل ملكية عنصر فريد، مثل عمل فني رقمي، أو مقطع فيديو، أو قطعة موسيقية. على عكس العملات المشفرة التقليدية مثل البيتكوين أو الإيثيريوم، التي يمكن استبدالها بعضها ببعض، كل NFT فريد ولا يمكن استبداله بآخر.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">كيف تعمل الـ NFTs؟</h2>
        <p className="mb-4">تستخدم معظم الـ NFTs تقنية البلوكتشين الخاصة بالإيثيريوم، مما يضمن أن كل رمز فريد ويمكن التحقق من ملكيته. عندما تشتري NFT، فأنت تشتري شهادة ملكية رقمية مسجلة على البلوكتشين، تثبت أنك تمتلك النسخة الأصلية من العنصر.</p>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">أنواع الـ NFTs</h2>
        <p className="mb-4">تتنوع أنواع الـ NFTs لتشمل:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>الفن الرقمي:</strong> وهو الأكثر شهرة، ويشمل الصور والرسومات والتصميمات الرقمية.</li>
          <li><strong>الموسيقى:</strong> يمكن للفنانين بيع أغانيهم وألبوماتهم كـ NFTs.</li>
          <li><strong>مقاطع الفيديو:</strong> مثل اللحظات الرياضية المميزة أو مقاطع الفيديو القصيرة.</li>
          <li><strong>العناصر داخل الألعاب:</strong> مثل الشخصيات أو الأسلحة أو الملابس في الألعاب الإلكترونية.</li>
          <li><strong>المجال الافتراضي:</strong> قطع من الأراضي في العوالم الافتراضية مثل Decentraland.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">كيفية شراء وبيع الـ NFTs</h2>
        <p className="mb-4">إليك الخطوات الأساسية لشراء وبيع الـ NFTs:</p>
        <ol className="list-decimal list-inside mb-4 space-y-2">
          <li><strong>إنشاء محفظة إيثيريوم:</strong> ستحتاج إلى محفظة تدعم معيار ERC-721 (مثل MetaMask).</li>
          <li><strong>شراء الإيثيريوم:</strong> معظم الـ NFTs تباع بالإيثيريوم، لذا ستحتاج إلى شرائه من منصة تبادل.</li>
          <li><strong>اختيار سوق الـ NFTs:</strong> هناك العديد من الأسواق مثل OpenSea، و Rarible، و SuperRare، و Foundation.</li>
          <li><strong>ربط محفظتك بالسوق:</strong> وذلك لتتمكن من شراء أو بيع الـ NFTs.</li>
          <li><strong>تصفح واختيار الـ NFTs:</strong> يمكنك تصفح الأسواق للعثور على الـ NFTs التي تهمك.</li>
          <li><strong>تقديم العروض أو الشراء مباشرة:</strong> يمكنك إما تقديم عرض أو شراء NFT بالسعر المحدد.</li>
          <li><strong>للبيع، قم بإنشاء NFT:</strong> إذا كنت ترغب في بيع عملك الفني، يمكنك "سك" NFT الخاص بك عبر السوق.</li>
        </ol>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">استراتيجيات الاستثمار في الـ NFTs</h2>
        <p className="mb-4">إليك بعض الاستراتيجيات التي يمكنك اتباعها عند الاستثمار في الـ NFTs:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>البحث عن الفنانين الناشئين:</strong> ابحث عن الفنانين الموهوبين الذين لم يشتهروا بعد، وقد ترتفع قيمة أعمالهم مع الوقت.</li>
          <li><strong>متابعة المجموعات الشهيرة:</strong> بعض مجموعات الـ NFTs مثل CryptoPunks و Bored Ape Yacht Club أصبحت استثمارات قيمة.</li>
          <li><strong>البحث عن الندرة:</strong> كلما كان الـ NFT أكثر ندرة، زادت قيمته المحتملة.</li>
          <li><strong>التفكير طويل المدى:</strong> قد يكون الاستثمار في الـ NFTs استثمارًا طويل المدى، حيث قد تستغرق السوق وقتًا للنضوج.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">مخاطر الاستثمار في الـ NFTs</h2>
        <p className="mb-4">مثل أي استثمار، يأتي الاستثمار في الـ NFTs بمخاطره الخاصة:</p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li><strong>تقلب الأسعار:</strong> قد تتقلب أسعار الـ NFTs بشكل كبير.</li>
          <li><strong>السيولة:</strong> قد يكون من الصعب بيع الـ NFTs بسرعة، خاصة في الأسواق الهابطة.</li>
          <li><strong>عمليات الاحتيال:</strong> هناك الكثير من عمليات الاحتيال في سوق الـ NFTs، لذا كن حذرًا.</li>
          <li><strong>الديمومة:</strong> قد تواجه مشاكل في الوصول إلى الـ NFT الخاص بك إذا أغلق السوق الذي اشتريته منه.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">الخلاصة</h2>
        <p className="mb-4">الـ NFTs تمثل تحولاً ثوريًا في كيفية تعريف وتداول الملكية الرقمية. سواء كنت فنانًا يبحث عن طرق جديدة لبيع عملك، أو مستثمرًا يبحث عن فرص في سوق جديد، فإن فهم أساسيات الـ NFTs أمر ضروري. كن مطلعًا، وقم بالأبحاث الخاصة بك، واستثمر بحذر، وقد تجد فرصًا مثيرة في عالم الـ NFTs.</p>
      `
    },
    "best-crypto-wallets-2025": {
      id: 4,
      title: "أفضل محافظ العملات المشفرة لعام ٢٠٢٥",
      date: "٢٥ مارس ٢٠٢٥",
      category: "أدوات",
      image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      content: `<p>محتوى المقال القادم...</p>`
    },
    "avoid-crypto-scams": {
      id: 5,
      title: "كيف تتجنب عمليات الاحتيال في سوق العملات المشفرة؟",
      date: "١٨ مارس ٢٠٢٥",
      category: "أمان",
      image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      content: `<p>محتوى المقال القادم...</p>`
    },
    "defi-future-arabic-region": {
      id: 6,
      title: "مستقبل التمويل اللامركزي (DeFi) في المنطقة العربية",
      date: "١٠ مارس ٢٠٢٥",
      category: "تحليلات",
      image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      content: `<p>محتوى المقال القادم...</p>`
    }
  };

  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-crypto-darkBlue">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container-custom mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">المقال غير موجود</h1>
            <Link to="/blog">
              <Button className="bg-crypto-orange hover:bg-crypto-orange/80 text-white">
                <ChevronLeft className="ml-2 h-4 w-4 rtl-flip" />
                العودة إلى المدونة
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crypto-darkBlue">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container-custom mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Link to="/blog" className="text-gray-400 hover:text-crypto-orange transition-colors inline-flex items-center">
              <ChevronLeft className="ml-1 h-4 w-4 rtl-flip" />
              العودة إلى المدونة
            </Link>
          </div>

          {/* Blog Post Header */}
          <div className="mb-8">
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <Calendar className="h-4 w-4 ml-1" />
              <span>{post.date}</span>
              <span className="mr-3 bg-crypto-orange text-white text-xs font-medium py-1 px-2 rounded">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-6">{post.title}</h1>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Blog Post Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-gray-300 leading-relaxed space-y-4" />
          </article>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold mb-4">شارك المقال</h3>
            <div className="flex space-x-4 space-x-reverse">
              <Button className="bg-transparent hover:bg-crypto-darkBlue text-crypto-orange hover:text-crypto-orange border border-crypto-orange hover:border-crypto-orange">
                مشاركة على تويتر
              </Button>
              <Button className="bg-transparent hover:bg-crypto-darkBlue text-crypto-orange hover:text-crypto-orange border border-crypto-orange hover:border-crypto-orange">
                مشاركة على فيسبوك
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;
