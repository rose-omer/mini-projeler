# Gemini 2.0 Flash Chat Interface

<div align="center">
  <img src="https://img.shields.io/badge/Python-3.9+-blue?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/Gradio-4.0+-green?logo=gradio" alt="Gradio">
  <img src="https://img.shields.io/badge/Gemini-2.0_Flash-orange?logo=google" alt="Gemini">
  <img src="https://img.shields.io/github/license/yourusername/gemini-chat?color=purple" alt="License">
</div>

**Google Gemini 2.0 Flash API kullanarak geliştirilen multimodal (metin + görsel) AI sohbet arayüzü**


## Öne Çıkan Özellikler

- **Multimodal Etkileşim**: Metin ve resimleri aynı anda işleyebilme
- **Gerçek Zamanlı Tarihçe**: Dinamik sohbet geçmişi görüntüleme
- **Kullanıcı Dostu Arayüz**: Gradio ile responsive tasarım
- **Akıllı Context Yönetimi**: Uzun konuşmalarda bağlam koruma
- **Güvenli API Entegrasyonu**: Çevre değişkenleriyle anahtar yönetimi

## Kurulum

### Ön Koşullar
- Python 3.9+
- Google Gemini API anahtarı ([Almak için tıkla](https://ai.google.dev/))

https://github.com/user-attachments/assets/f869bab8-238b-479d-bda5-72a2b3d9f6ed

### Adım Adım Kurulum
```bash
# Repoyu klonla
git clone https://github.com/yourusername/gemini-chat.git
cd gemini-chat

# Sanal ortam oluştur ve etkinleştir (Opsiyonel)
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows

# Gerekli paketleri yükle
pip install -r requirements.txt
