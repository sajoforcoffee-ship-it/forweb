/** Loading ekranında gösterilen kahve bilgileri (yaklaşık 150–250 karakter). */
export const KAHVE_BILGILERI = [
  "Kahve çekirdeği aslında bir meyvenin çekirdeğidir. Kiraza benzeyen kahve meyvesinin içinden çıkan bu tohum, kavurma sırasında yüzlerce aroma bileşiğine dönüşerek fincandaki karakteri belirler.",
  "Arabica çekirdekleri yüksek rakımda, serin ve nemli iklimlerde yavaş olgunlaşır. Bu yavaşlık asitliği dengeler, çiçeksi ve meyveli notaların çekirdekte daha belirgin şekilde gelişmesini sağlar.",
  "Öğütme kalınlığı, demlemenin en kritik değişkenidir. Espresso için ince, filtre için orta, French press için iri öğütme gerekir; yanlış kalınlık aynı çekirdeği acı veya cılız gösterebilir.",
  "İdeal demleme suyu 90–96 derece arasındadır. Kaynayan su çekirdeği yakarak acılık bırakır, çok soğuk su ise aromaları yeterince çözemez ve fincanda düz bir tat oluşur.",
  "Kavrulmuş kahve, öğütüldükten sonra aromasını dakikalar içinde kaybetmeye başlar. Bu yüzden çekirdeği demlemeden hemen önce öğütmek, tazeliği korumanın en etkili yoludur.",
  "Tek köken kahveler yetiştikleri toprağın izini taşır. Etiyopya'da çiçeksi ve çay benzeri, Brezilya'da fındıklı ve çikolatalı notalar öne çıkar; harmanlar ise dengeyi hedefler.",
  "Espresso, yaklaşık dokuz bar basınçla 25–30 saniyede hazırlanır. Yüzeyindeki crema tabakası, çekirdekteki karbondioksitin yağlarla birleşmesiyle oluşan tazelik göstergesidir.",
  "Kahve çekirdeğini buzdolabında değil, ışık almayan hava geçirmez bir kapta oda sıcaklığında saklamak gerekir. Nem ve koku, çekirdeğin aromasını en hızlı bozan iki etkendir.",
];

export function rastgeleKahveBilgisi(): string {
  const i = Math.floor(Math.random() * KAHVE_BILGILERI.length);
  return KAHVE_BILGILERI[i] ?? KAHVE_BILGILERI[0]!;
}
