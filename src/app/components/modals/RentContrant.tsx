import React, { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { X, User, MapPin, FileText, CreditCard, Home } from "lucide-react";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Rent_Contract = ({ open, setOpen }: any) => {
  const [newContract, setNewContract] = useState({
    part_1: {
      city: "",
      county: "",
      neighbourhood: "",
      mainstreet: "",
      street: "",
      doorNumber: "",
      apartmentNumber: "",
      rentalType: "",
      renter: "",
      renterAddress: "",
      tenant: "",
      tenantAddress: "",
      guarantor: "",
      guarantorAddress: "",
    },
    part_2: {
      monthlyRent: 0,
      yearlyRent: 0,
      paymentType: "",
      rentalPeriod: "",
      rentalStartDate: "",
      deliveryStatus: "",
      usagePurpose: "",
    },
    part_3: {
      teslimAlinanDemirbaslar: [],
      specialConditions: "",
    },
    part_4: {
      rentalDeposit: 0,
      suretyBond: "",
      siteFee: 0,
      otherFees: 0,
      rentalAccountNumber: "",
      delayedPaymentInterest: "",
    },
    part_5: {
      stampDuty: "",
      contractStartDate: "",
      contractEndDate: "",
      notificationAddress: "",
      competentCourt: "",
    },
  }) as any;

  const handleClose = () => {
    setOpen({
      ...open,
      open: false,
      id: 0,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleChange = (e: any, part: any) => {
    setNewContract({
      ...newContract,
      [part]: {
        ...newContract[part],
        [e.target.name]: e.target.value,
      },
    });
  };

  const [demirbasInput, setDemirbasInput] = useState({
    name: "",
    quantity: 1,
  });

  const handleAddDemirbas = () => {
    setNewContract({
      ...newContract,
      part_3: {
        ...newContract.part_3,
        teslimAlinanDemirbaslar: [
          ...newContract.part_3.teslimAlinanDemirbaslar,
          `${demirbasInput.name} - ${demirbasInput.quantity} Adet`,
        ],
      },
    });
    setDemirbasInput({
      name: "",
      quantity: 1,
    });
  };

  const handleRemoveDemirbas = (index: number) => {
    let temp = newContract.part_3.teslimAlinanDemirbaslar;
    temp.splice(index, 1);
    setNewContract({
      ...newContract,
      part_3: {
        ...newContract.part_3,
        teslimAlinanDemirbaslar: temp,
      },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b bg-[#f0f0f0] w-full max-w-[900px] h-[95vh] overflow-y-auto flex flex-col rounded-xl relative"
        style={PoppinsFont.style}
      >
        {/* Header */}
        <div className="flex flex-row justify-between items-center py-3 px-5 bg-custom-orange sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white">Kira Sözleşmesi</h2>
          <button
            className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={handleClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Genel Bilgiler */}
          <div className="flex flex-col gap-3 my-5 relative border border-custom-orange rounded-md p-7 bg-white">
            <div className="absolute -top-4 left-5 flex flex-row gap-1 items-center bg-gray-300 border text-sm border-custom-orange px-3 py-1 rounded-sm">
              <User size={16} />
              Genel Bilgiler
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm">
                  Kiraya Veren Ad/Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="renter"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.renter}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Kiraya Veren Adres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="renterAddress"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.renterAddress}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">
                  Kiracı Ad/Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tenant"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.tenant}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Kiracı Adres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tenantAddress"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.tenantAddress}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">
                  Kefil Ad/Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guarantor"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.guarantor}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Kefil Adres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guarantorAddress"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.guarantorAddress}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
            </div>
          </div>

          {/* Kiralanan Yer Bilgileri */}
          <div className="flex flex-col gap-3 my-5 relative border border-custom-orange rounded-md p-7 bg-white">
            <div className="absolute -top-4 left-5 flex flex-row gap-1 items-center bg-gray-300 border text-sm border-custom-orange px-3 py-1 rounded-sm">
              <Home size={16} />
              Kiralanan Yer Bilgileri
            </div>
            <div className="grid grid-cols-6 gap-5">
              <div className="flex flex-col col-span-3 gap-2">
                <label className="text-sm">
                  İl <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.city}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-3 gap-2">
                <label className="text-sm">
                  İlçe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="county"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.county}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Mahalle <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="neighbourhood"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.neighbourhood}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Cadde <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mainstreet"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.mainstreet}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Sokak <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.street}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Daire No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="doorNumber"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.doorNumber}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Kapı No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apartmentNumber"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.apartmentNumber}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Kiralanan Yer Cinsi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rentalType"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_1.rentalType}
                  onChange={(e) => handleChange(e, "part_1")}
                />
              </div>
            </div>
          </div>

          {/* Genel Ödeme Bilgileri */}
          <div className="flex flex-col gap-3 my-5 relative border border-custom-orange rounded-md p-7 bg-white">
            <div className="absolute -top-4 left-5 flex flex-row gap-1 items-center bg-gray-300 border text-sm border-custom-orange px-3 py-1 rounded-sm">
              <CreditCard size={16} />
              Genel Ödeme Bilgileri
            </div>
            <div className="grid grid-cols-6 gap-5">
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Aylık Kira Bedeli <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="monthlyRent"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_2.monthlyRent}
                  onChange={(e) => handleChange(e, "part_2")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Yıllık Kira Bedeli <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="yearlyRent"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_2.yearlyRent}
                  onChange={(e) => handleChange(e, "part_2")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Ödeme Şekli <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="paymentType"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_2.paymentType}
                  onChange={(e) => handleChange(e, "part_2")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Kira Müddeti <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rentalPeriod"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_2.rentalPeriod}
                  onChange={(e) => handleChange(e, "part_2")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Kira Başlangıç Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="rentalStartDate"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_2.rentalStartDate}
                  onChange={(e) => handleChange(e, "part_2")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Teslim Durumu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="deliveryStatus"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_2.deliveryStatus}
                  onChange={(e) => handleChange(e, "part_2")}
                />
              </div>
              <div className="flex flex-col col-span-6 gap-2">
                <label className="text-sm">
                  Kullanım Amacı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="usagePurpose"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_2.usagePurpose}
                  onChange={(e) => handleChange(e, "part_2")}
                />
              </div>
            </div>
          </div>

          {/* Koşullar ve Demirbaşlar */}
          <div className="flex flex-col gap-3 my-5 relative border border-custom-orange rounded-md p-7 bg-white">
            <div className="absolute -top-4 left-5 flex flex-row gap-1 items-center bg-gray-300 border text-sm border-custom-orange px-3 py-1 rounded-sm">
              <FileText size={16} />
              Koşullar ve Demirbaşlar
            </div>
            <div className="grid grid-cols-6 gap-5">
              <div className="flex flex-col gap-2 col-span-6 shrink-0">
                <label className="text-sm w-48">
                  Teslim Alınan Demirbaşlar
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-row mx-auto gap-2">
                  <input
                    type="number"
                    name="quantity"
                    className="border border-gray-500 bg-transparent p-2 w-16 rounded"
                    placeholder="Adet"
                    min={1}
                    value={demirbasInput.quantity}
                    onChange={(e) =>
                      setDemirbasInput({
                        ...demirbasInput,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                  <div className="flex items-end">Adet</div>
                  <input
                    type="text"
                    name="name"
                    className="border border-gray-500 bg-transparent p-2 rounded flex-1"
                    placeholder="Demirbaş Adı"
                    value={demirbasInput.name}
                    onChange={(e) =>
                      setDemirbasInput({
                        ...demirbasInput,
                        name: e.target.value,
                      })
                    }
                  />
                  <button
                    className="bg-custom-orange text-white py-2 px-4 rounded hover:bg-custom-orange-dark transition-colors"
                    onClick={handleAddDemirbas}
                    type="button"
                  >
                    Demirbaş Ekle
                  </button>
                </div>
                <div className="flex flex-col mt-3 gap-2">
                  {newContract.part_3.teslimAlinanDemirbaslar.map(
                    (item: string, index: number) => (
                      <div
                        className="flex flex-row gap-2 items-center"
                        key={index}
                      >
                        {index + 1}.<p>{item}</p>
                        <button
                          className="text-red-500 underline hover:text-red-700"
                          onClick={() => handleRemoveDemirbas(index)}
                          type="button"
                        >
                          (Demirbaşı Sil)
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="flex flex-col col-span-6 gap-2">
                <label className="text-sm">
                  Özel Koşullar
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="specialConditions"
                  className="border border-gray-500 bg-transparent p-2 rounded h-24"
                  value={newContract.part_3.specialConditions}
                  onChange={(e) => handleChange(e, "part_3")}
                />
              </div>
            </div>
          </div>

          {/* Ödeme Yükümlülükleri */}
          <div className="flex flex-col gap-3 my-5 relative border border-custom-orange rounded-md p-7 bg-white">
            <div className="absolute -top-4 left-5 flex flex-row gap-1 items-center bg-gray-300 border text-sm border-custom-orange px-3 py-1 rounded-sm">
              <CreditCard size={16} />
              Ödeme Yükümlülükleri
            </div>
            <div className="grid grid-cols-6 gap-5">
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Kira Depozitosu <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="rentalDeposit"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_4.rentalDeposit}
                  onChange={(e) => handleChange(e, "part_4")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Site Aidatı <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="siteFee"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_4.siteFee}
                  onChange={(e) => handleChange(e, "part_4")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Diğer Ücretler <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="otherFees"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_4.otherFees}
                  onChange={(e) => handleChange(e, "part_4")}
                />
              </div>
              <div className="flex flex-col col-span-4 gap-2">
                <label className="text-sm">
                  Kira Hesap Numarası <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rentalAccountNumber"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_4.rentalAccountNumber}
                  onChange={(e) => handleChange(e, "part_4")}
                />
              </div>
              <div className="flex flex-col col-span-2 gap-2">
                <label className="text-sm">
                  Gecikme Faizi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="delayedPaymentInterest"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_4.delayedPaymentInterest}
                  onChange={(e) => handleChange(e, "part_4")}
                />
              </div>
              <div className="flex flex-col col-span-6 gap-2">
                <label className="text-sm">
                  Teminat Senedi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="suretyBond"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_4.suretyBond}
                  onChange={(e) => handleChange(e, "part_4")}
                />
              </div>
            </div>
          </div>

          {/* Diğer Bilgiler */}
          <div className="flex flex-col gap-3 my-5 relative border border-custom-orange rounded-md p-7 bg-white">
            <div className="absolute -top-4 left-5 flex flex-row gap-1 items-center bg-gray-300 border text-sm border-custom-orange px-3 py-1 rounded-sm">
              <MapPin size={16} />
              Diğer Bilgiler
            </div>
            <div className="grid grid-cols-6 gap-5">
              <div className="flex flex-col col-span-3 gap-2">
                <label className="text-sm">
                  Sözleşme Başlangıç Tarihi{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="contractStartDate"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_5.contractStartDate}
                  onChange={(e) => handleChange(e, "part_5")}
                />
              </div>
              <div className="flex flex-col col-span-3 gap-2">
                <label className="text-sm">
                  Sözleşme Bitiş Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="contractEndDate"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_5.contractEndDate}
                  onChange={(e) => handleChange(e, "part_5")}
                />
              </div>
              <div className="flex flex-col col-span-3 gap-2">
                <label className="text-sm">
                  Damga Vergisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stampDuty"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_5.stampDuty}
                  onChange={(e) => handleChange(e, "part_5")}
                />
              </div>
              <div className="flex flex-col col-span-3 gap-2">
                <label className="text-sm">
                  Bildirim Adresi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="notificationAddress"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_5.notificationAddress}
                  onChange={(e) => handleChange(e, "part_5")}
                />
              </div>
              <div className="flex flex-col col-span-6 gap-2">
                <label className="text-sm">
                  Yetkili Mahkeme <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="competentCourt"
                  className="border border-gray-500 bg-transparent p-2 rounded"
                  value={newContract.part_5.competentCourt}
                  onChange={(e) => handleChange(e, "part_5")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-[#f0f0f0] p-4 border-t">
          <button
            className="bg-custom-orange w-full shadow-xl text-white py-3 px-5 rounded-md hover:bg-custom-orange-dark transition-colors font-semibold"
            type="submit"
          >
            Sözleşmeyi Oluştur
          </button>
        </div>
      </form>
    </div>
  );
};

export default Rent_Contract;
