import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'Nayaka-Rudhy@lostandfound.id',
      href: 'mailto:Nayaka-Rudhy@lostandfound.id',
    },
    {
      icon: Phone,
      title: 'Telepon',
      value: '+62 21 1234 5678',
      href: 'tel:+622112345678',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+62 812 3456 7890',
      href: 'https://wa.me/6281234567890',
    },
    {
      icon: MapPin,
      title: 'Alamat',
      value: 'Yogyakarta, Indonesia',
      href: '#',
    },
  ];

  const faqs = [
    {
      question: 'Bagaimana cara melaporkan barang hilang?',
      answer: 'Klik tombol "Laporkan Barang Hilang" di halaman utama, lalu isi formulir dengan detail barang yang hilang termasuk foto, lokasi, dan deskripsi.',
    },
    {
      question: 'Apakah layanan ini berbayar?',
      answer: 'Tidak, layanan Lost & Found kami sepenuhnya gratis untuk membantu masyarakat menemukan barang mereka.',
    },
    {
      question: 'Bagaimana cara mengklaim barang yang ditemukan?',
      answer: 'Hubungi pelapor melalui kontak yang tersedia dan berikan bukti kepemilikan seperti foto, nota pembelian, atau ciri-ciri khusus barang.',
    },
    {
      question: 'Apakah data saya aman?',
      answer: 'Ya, kami menjaga keamanan data Anda dan hanya menampilkan informasi yang diperlukan untuk proses pelaporan dan klaim.',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      
      <main className="pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Hubungi Kami
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ada pertanyaan atau membutuhkan bantuan? Tim kami siap membantu Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border p-6 md:p-8 shadow-soft">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Informasi Kontak
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.title}</p>
                      <p className="font-medium text-foreground">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border p-6 md:p-8 shadow-soft">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Pertanyaan Umum
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-secondary/50"
                  >
                    <h3 className="font-semibold text-foreground mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
