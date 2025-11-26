"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Category, FeatureValues, Subcategory } from "@/app/types/category";
import PropertyTypeTab from "@/app/components/tabs/ProppertyTypeTabs";
import ListingTypeTab from "@/app/components/tabs/ListingTypeTab";
import CategoryTab from "@/app/components/tabs/CategoryTab";
import BasicInfoTab from "@/app/components/tabs/BasicInfoTab";
import MediaTab from "@/app/components/tabs/MediaTab";
import LocationTab from "@/app/components/tabs/LocationTab";
import DetailsTab from "@/app/components/tabs/DetailsTab";
import FeaturesTab from "@/app/components/tabs/FeaturesTab";
import OtherInfoTab from "@/app/components/tabs/OtherInfoTab";
import CategorySelection from "@/app/components/tabs/CategorySelectionTab";
import {
  MapPin,
  Home,
  Camera,
  Settings,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X,
  Star,
  Ruler,
  Building,
  FileText,
  Users,
  Trash2,
  ChevronDown,
  Image as ImageIcon,
  Move,
  Tag,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Link from "next/link";
import JSONDATA from "@/app/data.json";

import {
  propertyTypes,
  listingTypes,
  propertyCategories,
  defaultFormData,
  contractTimes,
  yesNoOptions,
  keyOptions,
  currencyOptions,
  directionOptions,
  heatingOptions,
  deedStatusOptions,
  zoningStatusOptions,
} from "@/app/data/propertyData";
import {
  type FormData,
  StepState,
  ImageItem,
  SelectionItem,
} from "@/app/types/property";
import api from "@/app/lib/api";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { useParams, useRouter } from "next/navigation";

const SimpleInput = React.memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    icon: Icon,
    className = "",
    ...props
  }: any) => {
    return (
      <div className={`relative ${className}`}>
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 z-10">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black transition-colors ${
            Icon ? "pl-11" : "pl-4"
          } placeholder-gray-400 outline-none`}
          {...props}
        />
        <label className="absolute -top-2 left-3 bg-white px-2 text-xs text-gray-700 font-semibold pointer-events-none">
          {label}
        </label>
      </div>
    );
  }
);

SimpleInput.displayName = "SimpleInput";

const SimpleTextarea = React.memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    className = "",
    rows = 4,
    ...props
  }: any) => {
    return (
      <div className={`relative ${className}`}>
        <textarea
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black resize-none transition-colors placeholder-gray-400 outline-none`}
          {...props}
        />
        <label className="absolute -top-2 left-3 bg-white px-2 text-xs text-gray-700 font-semibold pointer-events-none">
          {label}
        </label>
      </div>
    );
  }
);

SimpleTextarea.displayName = "SimpleTextarea";

const SimpleSelect = React.memo(
  ({ label, value, onChange, options, icon: Icon, className = "" }: any) => {
    return (
      <div className={`relative ${className}`}>
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 z-10">
            <Icon size={20} />
          </div>
        )}
        <select
          value={value || ""}
          onChange={onChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black appearance-none transition-colors ${
            Icon ? "pl-11" : "pl-4"
          } outline-none cursor-pointer`}
        >
          {options.map((option: any) => (
            <option
              key={option.value || option}
              value={option.value || option}
              className="text-black"
            >
              {option.label || option}
            </option>
          ))}
        </select>
        <label className="absolute -top-2 left-3 bg-white px-2 text-xs text-gray-700 font-semibold pointer-events-none">
          {label}
        </label>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown size={16} className="text-gray-600" />
        </div>
      </div>
    );
  }
);

SimpleSelect.displayName = "SimpleSelect";

const FeatureToggle = React.memo(
  ({ label, value, onChange, className = "" }: any) => (
    <div
      className={`flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors duration-200 ${className}`}
    >
      <span className="font-medium text-gray-900">{label}</span>
      <button
        type="button"
        onClick={() => onChange(value === "Evet" ? "Hayır" : "Evet")}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          value === "Evet" ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            value === "Evet" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
);

FeatureToggle.displayName = "FeatureToggle";

const QuestionToggle = React.memo(
  ({ label, value, onChange, className = "" }: any) => (
    <div
      className={`flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-green-400 transition-colors duration-200 ${className}`}
    >
      <span className="font-medium text-gray-900 text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(value === "Evet" ? "Hayır" : "Evet")}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
          value === "Evet" ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
            value === "Evet" ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
);

QuestionToggle.displayName = "QuestionToggle";

const turkeyCities = JSONDATA.map((city: any) => {
  return {
    province: city.name,
    districts: city.towns.map((district: any) => {
      return {
        district: district.name,
        quarters: district.districts.reduce((acc: any, district: any) => {
          const quarterNames = district.quarters.map(
            (quarter: any) => quarter.name
          );
          return acc.concat(quarterNames);
        }, []),
      };
    }),
  };
});

const createSelectionItem = (
  value: string,
  selections: string[]
): SelectionItem => ({
  value,
  selections,
});

export default function EditE() {
  const [cookies] = useCookies(["token"]);
  const params = useParams();
  const router = useRouter();
  const advertUid = params.uid as string;

  const [activeTab, setActiveTab] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [reOrderImages, setReOrderImages] = useState(false);
  const [marker, setMarker] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [isActiveAd, setIsActiveAd] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<Subcategory | null>(null);
  const [featureValues, setFeatureValues] = useState<FeatureValues>({});
  const [scrollPosition, setScrollPosition] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const [firstStep, setFirstStep] = useState<StepState>({
    selected: { isSelect: false, value: "" },
    selections: propertyTypes,
  });

  const [secondStep, setSecondStep] = useState<StepState>({
    selected: { isSelect: false, value: "" },
    selections: listingTypes,
  });

  const [thirdStep, setThirdStep] = useState<StepState>({
    selected: { isSelect: false, value: "" },
    selections: propertyCategories,
  });

  const [fourthStep, setFourthStep] = useState<FormData>({
    ...defaultFormData,
    price: {
      value: "",
      type: "TL",
      selections: currencyOptions,
    },
  });

  const [images, setImages] = useState<ImageItem[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);

  const tabs = [
    { id: 1, label: "Emlak Türü", icon: Home },
    { id: 2, label: "İlan Tipi", icon: FileText },
    { id: 3, label: "Kategori", icon: Building },
    { id: 4, label: "Temel Bilgiler", icon: Settings },
    { id: 5, label: "Medya", icon: Camera },
    { id: 6, label: "Konum", icon: MapPin },
    { id: 7, label: "Detaylar", icon: Ruler },
    { id: 8, label: "Özellikler", icon: Star },
    { id: 9, label: "Diğer", icon: Users },
    { id: 10, label: "Kategori & Özellikler", icon: Tag },
  ];
  useEffect(() => {
    const fetchAdvertData = async () => {
      try {
        setIsLoading(true);
        console.log("📥 İlan verileri yükleniyor...", advertUid);

        const response = await api.get(`admin/adverts/${advertUid}`);
        let advertData;
        if (response.data && response.data.data) {
          advertData = response.data.data;
        } else if (response.data) {
          advertData = response.data;
        } else {
          throw new Error("Geçersiz response formatı");
        }

        if (!advertData) {
          toast.error("İlan bulunamadı");
          router.push("/admin/emlak");
          return;
        }

        setFirstStep({
          selected: {
            isSelect: true,
            value: advertData.steps?.first || advertData.propertyType || "",
          },
          selections: propertyTypes,
        });

        setSecondStep({
          selected: {
            isSelect: true,
            value: advertData.steps?.second || advertData.listingType || "",
          },
          selections: listingTypes,
        });

        setThirdStep({
          selected: {
            isSelect: true,
            value: advertData.steps?.third || advertData.category || "",
          },
          selections: propertyCategories,
        });

        const feeValue = advertData.fee
          ? typeof advertData.fee === "string"
            ? advertData.fee.split(" ")[0].replace(/\./g, "")
            : advertData.fee.toString().replace(/\./g, "")
          : "0";

        const feeType = advertData.fee
          ? typeof advertData.fee === "string"
            ? advertData.fee.split(" ")[1] || "TL"
            : "TL"
          : "TL";

        setFourthStep({
          title: advertData.title || "",
          description: advertData.description || "",
          customer:
            advertData.customer?.uid?.toString() ||
            advertData.customer?.toString() ||
            "",
          contract_no: advertData.contract?.no || advertData.contractNo || "",
          contract_date:
            advertData.contract?.date || advertData.contractDate || "",
          contract_time: createSelectionItem(
            advertData.contract?.time || advertData.contractTime || "",
            contractTimes
          ),
          advisor:
            advertData.advisor?.uid?.toString() ||
            advertData.advisor?.toString() ||
            "",
          advisor_profile: createSelectionItem(
            advertData.advisor?.peopleCanSeeProfile ? "Evet" : "Hayır",
            yesNoOptions
          ),
          eids: {
            no: advertData.eidsNo || advertData.eids?.no || "",
            date: advertData.eidsDate || advertData.eids?.date || "",
            value: advertData.eidsNo ? "Evet" : "Hayır",
          },
          key: createSelectionItem(
            advertData.whoseKey || "Yenigün Emlak",
            keyOptions
          ),
          adminNote: advertData.adminNote || "",
          price: {
            value: feeValue,
            type: feeType,
            selections: currencyOptions,
          },
          province: advertData.address?.province || advertData.province || "",
          district: advertData.address?.district || advertData.district || "",
          quarter: advertData.address?.quarter || advertData.quarter || "",
          address: advertData.address?.full_address || advertData.address || "",
          parsel: advertData.address?.parcel || advertData.parcel || "",
          roomCount:
            advertData.details?.roomCount || advertData.roomCount || "",
          netArea: advertData.details?.netArea || advertData.netArea || 0,
          grossArea: advertData.details?.grossArea || advertData.grossArea || 0,
          buildingAge:
            advertData.details?.buildingAge || advertData.buildingAge || 0,
          elevator: createSelectionItem(
            advertData.details?.elevator ? "Evet" : "Hayır",
            yesNoOptions
          ),
          inSite: createSelectionItem(
            advertData.details?.inSite ? "Evet" : "Hayır",
            yesNoOptions
          ),
          whichSide: createSelectionItem(
            advertData.details?.whichSide || advertData.whichSide || "",
            directionOptions
          ),
          acre: advertData.details?.acre
            ? parseInt(advertData.details.acre)
            : advertData.acre || 0,
          acreText: advertData.details?.acre || advertData.acreText || "",
          floor: advertData.details?.floor || advertData.floor || 0,
          totalFloor:
            advertData.details?.totalFloor || advertData.totalFloor || 0,
          balcony: createSelectionItem(
            advertData.details?.balcony ? "Evet" : "Hayır",
            yesNoOptions
          ),
          balconyCount:
            advertData.details?.balconyCount || advertData.balconyCount || 0,
          isFurnished: createSelectionItem(
            advertData.details?.furniture ? "Evet" : "Hayır",
            yesNoOptions
          ),
          heating: createSelectionItem(
            advertData.details?.heating || advertData.heating || "",
            heatingOptions
          ),
          deedStatus: createSelectionItem(
            advertData.details?.deed || advertData.deedStatus || "",
            deedStatusOptions
          ),
          zoningStatus: createSelectionItem(
            advertData.details?.zoningStatus || advertData.zoningStatus || "",
            zoningStatusOptions
          ),
          agenda_emlak: createSelectionItem(
            advertData.questions?.agendaEmlak ? "Evet" : "Hayır",
            yesNoOptions
          ),
          homepage_emlak: createSelectionItem(
            advertData.questions?.homepageEmlak ? "Evet" : "Hayır",
            yesNoOptions
          ),
          new_emlak: createSelectionItem(
            advertData.questions?.new_emlak ? "Evet" : "Hayır",
            yesNoOptions
          ),
          chance_emlak: createSelectionItem(
            advertData.questions?.chance_emlak ? "Evet" : "Hayır",
            yesNoOptions
          ),
          special_emlak: createSelectionItem(
            advertData.questions?.special_emlak ? "Evet" : "Hayır",
            yesNoOptions
          ),
          onweb_emlak: createSelectionItem(
            advertData.questions?.onweb_emlak ? "Evet" : "Hayır",
            yesNoOptions
          ),
        });

        setContent(advertData.thoughts || "");
        setIsActiveAd(advertData.active !== false);

        if (advertData.images) {
          console.log(`🖼️ ${advertData.images.length} adet resim bulundu`);
          setExistingImages(
            Array.isArray(advertData.images) ? advertData.images : []
          );
        }

        if (advertData.video) {
          console.log("🎥 Video bulundu:", advertData.video);
          setExistingVideo(advertData.video);
        }

        if (advertData.address?.mapCoordinates) {
          console.log(
            "📍 Harita koordinatları:",
            advertData.address.mapCoordinates
          );
          setMarker([{ lat: advertData.address.mapCoordinates, lng: 0 }]);
        } else if (advertData.mapCoordinates) {
          console.log("📍 Harita koordinatları:", advertData.mapCoordinates);
          setMarker([{ lat: advertData.mapCoordinates, lng: 0 }]);
        }

        console.log("✅ State'ler başarıyla güncellendi");
      } catch (error: any) {
        console.error("❌ İlan verileri yüklenemedi:", error);

        if (error.response?.status === 404) {
          toast.error("İlan bulunamadı");
          router.push("/admin/emlak");
        } else {
          toast.error("İlan verileri yüklenemedi");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (advertUid) {
      fetchAdvertData();
    }
  }, [advertUid, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await api.get("/admin/customers");
        setCustomers(customersResponse.data.data || customersResponse.data);

        const advisorsResponse = await api.get("/admin/users");
        setAdvisors(advisorsResponse.data.data || advisorsResponse.data);
      } catch (error: any) {
        console.error("❌ Veriler yüklenemedi:", error);
        toast.error("Bir hata oluştu. Lütfen sayfayı yenileyin.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/admin/categories");
        let categoriesData = response.data;

        if (response.data && response.data.data) {
          categoriesData = response.data.data;
        }

        if (!Array.isArray(categoriesData)) {
          categoriesData = [];
        }

        setCategories(categoriesData);
      } catch (error: any) {
        console.error("❌ Kategoriler yüklenemedi:", error);
        toast.error("Kategoriler yüklenemedi");
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImages = Array.from(event.target.files || []);
    const currentLength = images.length;

    if (selectedImages.length + images.length > 35) {
      alert("En fazla 35 resim seçebilirsiniz.");
      return;
    }

    const newImages = selectedImages.map((image, index) => ({
      id: (currentLength + index + 1).toString(),
      src: image as File,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedVideo = event.target.files?.[0];
    if (selectedVideo) {
      setVideoFile(selectedVideo);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerVideoInput = () => {
    videoInputRef.current?.click();
  };

  const formatNumber = (number: any) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChangeAcre = (input: any) => {
    const numericInput = input.replace(/\D/g, "");
    const m2 = `${numericInput.slice(
      numericInput.length > 3 ? numericInput.length - 3 : 0,
      numericInput.length
    )} m²`;
    const acre =
      numericInput.length >= 4
        ? `${numericInput[numericInput.length - 4]} dönüm `
        : "";
    const decare =
      numericInput.length >= 5
        ? `${numericInput.slice(0, numericInput.length - 4)} hektar `
        : "";

    setFourthStep({
      ...fourthStep,
      acre: Number(numericInput),
      acreText: `${decare}${acre}${m2}`,
    });
  };

  const updateFourthStep = useCallback((field: keyof FormData, value: any) => {
    setFourthStep((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateNestedFourthStep = useCallback(
    (parentField: keyof FormData, childField: string, value: any) => {
      setFourthStep((prev) => ({
        ...prev,
        [parentField]: {
          ...(prev[parentField] as any),
          [childField]: value,
        },
      }));
    },
    []
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("title", e.target.value);
    },
    [updateFourthStep]
  );

  const handlePriceValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\./g, "");
      if (!isNaN(Number(rawValue)) && rawValue.length <= 15) {
        const formattedValue = formatNumber(rawValue);
        updateNestedFourthStep("price", "value", formattedValue);
      }
    },
    [updateNestedFourthStep]
  );

  const handlePriceTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNestedFourthStep("price", "type", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleAdminNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateFourthStep("adminNote", e.target.value);
    },
    [updateFourthStep]
  );

  const handleProvinceChange = useCallback(
    (value: any) => {
      updateFourthStep("province", value);
    },
    [updateFourthStep]
  );

  const handleDistrictChange = useCallback(
    (value: any) => {
      updateFourthStep("district", value);
    },
    [updateFourthStep]
  );

  const handleQuarterChange = useCallback(
    (value: any) => {
      updateFourthStep("quarter", value);
    },
    [updateFourthStep]
  );

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("address", e.target.value);
    },
    [updateFourthStep]
  );

  const handleParselChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("parsel", e.target.value);
    },
    [updateFourthStep]
  );

  const handleRoomCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("roomCount", e.target.value);
    },
    [updateFourthStep]
  );

  const handleFloorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("floor", Number(e.target.value));
    },
    [updateFourthStep]
  );

  const handleTotalFloorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("totalFloor", Number(e.target.value));
    },
    [updateFourthStep]
  );

  const handleBuildingAgeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("buildingAge", Number(e.target.value));
    },
    [updateFourthStep]
  );

  const handleNetAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("netArea", Number(e.target.value));
    },
    [updateFourthStep]
  );

  const handleGrossAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("grossArea", Number(e.target.value));
    },
    [updateFourthStep]
  );

  const handleBalconyCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("balconyCount", Number(e.target.value));
    },
    [updateFourthStep]
  );

  const handleAcreChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChangeAcre(e.target.value);
    },
    []
  );

  const handleCustomerChange = useCallback(
    (value: any) => {
      updateFourthStep("customer", value);
    },
    [updateFourthStep]
  );

  const handleAdvisorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateFourthStep("advisor", e.target.value);
    },
    [updateFourthStep]
  );

  const handleContractNoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const justNumReg = /^[0-9\b]+$/;
      if (e.target.value === "" || justNumReg.test(e.target.value)) {
        updateFourthStep("contract_no", e.target.value);
      }
    },
    [updateFourthStep]
  );

  const handleContractDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFourthStep("contract_date", e.target.value);
    },
    [updateFourthStep]
  );

  const handleContractTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNestedFourthStep("contract_time", "value", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleEidsValueChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNestedFourthStep("eids", "value", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleEidsNoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNestedFourthStep("eids", "no", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleEidsDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNestedFourthStep("eids", "date", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleKeyChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNestedFourthStep("key", "value", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleHeatingChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNestedFourthStep("heating", "value", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleDeedStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNestedFourthStep("deedStatus", "value", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleWhichSideChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNestedFourthStep("whichSide", "value", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleZoningStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateNestedFourthStep("zoningStatus", "value", e.target.value);
    },
    [updateNestedFourthStep]
  );

  const handleElevatorToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "elevator",
        createSelectionItem(value, fourthStep.elevator.selections)
      );
    },
    [updateFourthStep, fourthStep.elevator]
  );

  const handleInSiteToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "inSite",
        createSelectionItem(value, fourthStep.inSite.selections)
      );
    },
    [updateFourthStep, fourthStep.inSite]
  );

  const handleBalconyToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "balcony",
        createSelectionItem(value, fourthStep.balcony.selections)
      );
    },
    [updateFourthStep, fourthStep.balcony]
  );

  const handleIsFurnishedToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "isFurnished",
        createSelectionItem(value, fourthStep.isFurnished.selections)
      );
    },
    [updateFourthStep, fourthStep.isFurnished]
  );

  const handleAdvisorProfileToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "advisor_profile",
        createSelectionItem(value, fourthStep.advisor_profile.selections)
      );
    },
    [updateFourthStep, fourthStep.advisor_profile]
  );

  const handleAgendaEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "agenda_emlak",
        createSelectionItem(value, fourthStep.agenda_emlak.selections)
      );
    },
    [updateFourthStep, fourthStep.agenda_emlak]
  );

  const handleHomepageEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "homepage_emlak",
        createSelectionItem(value, fourthStep.homepage_emlak.selections)
      );
    },
    [updateFourthStep, fourthStep.homepage_emlak]
  );

  const handleNewEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "new_emlak",
        createSelectionItem(value, fourthStep.new_emlak.selections)
      );
    },
    [updateFourthStep, fourthStep.new_emlak]
  );

  const handleChanceEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "chance_emlak",
        createSelectionItem(value, fourthStep.chance_emlak.selections)
      );
    },
    [updateFourthStep, fourthStep.chance_emlak]
  );

  const handleSpecialEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "special_emlak",
        createSelectionItem(value, fourthStep.special_emlak.selections)
      );
    },
    [updateFourthStep, fourthStep.special_emlak]
  );

  const handleOnwebEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep(
        "onweb_emlak",
        createSelectionItem(value, fourthStep.onweb_emlak.selections)
      );
    },
    [updateFourthStep, fourthStep.onweb_emlak]
  );

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setFeatureValues({});
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    setFeatureValues({});
  };

  const handleFeatureChange = (featureId: string, value: any) => {
    setFeatureValues((prev) => ({
      ...prev,
      [featureId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!fourthStep.customer) {
      toast.error("Lütfen bir müşteri seçiniz.");
      setIsSubmitting(false);
      return;
    }

    if (!fourthStep.title) {
      toast.error("Lütfen ilan başlığını giriniz.");
      setIsSubmitting(false);
      return;
    }

    try {
      const eidsDateTimestamp = fourthStep.eids?.date
        ? new Date(fourthStep.eids.date).getTime()
        : null;

      const contractDateTimestamp = fourthStep.contract_date
        ? new Date(fourthStep.contract_date).getTime()
        : Date.now();

      const feeValue = fourthStep.price?.value || "0";
      const feeType = fourthStep.price?.type || "TL";

      const formattedFee = `${feeValue} ${feeType}`;
      console.log(
        "💰 Price değeri backend'e şu şekilde gidiyor:",
        formattedFee
      );
      const requestData: any = {
        uid: Number(advertUid),
        steps: {
          first: firstStep.selected?.value || "",
          second: secondStep.selected?.value || "",
          third: thirdStep.selected?.value || "",
        },
        title: fourthStep.title || "",
        customer: Number(fourthStep.customer) || 0,
        contract: {
          no: fourthStep.contract_no || "",
          date: contractDateTimestamp,
          time: fourthStep.contract_time?.value || "",
        },
        advisor: {
          uid: Number(fourthStep.advisor) || 0,
          peopleCanSeeProfile: fourthStep.advisor_profile?.value === "Evet",
        },
        eidsNo: fourthStep.eids?.no || "",
        eidsDate: eidsDateTimestamp,
        questions: {
          agendaEmlak: fourthStep.agenda_emlak?.value === "Evet",
          homepageEmlak: fourthStep.homepage_emlak?.value === "Evet",
          new_emlak: fourthStep.new_emlak?.value === "Evet",
          chance_emlak: fourthStep.chance_emlak?.value === "Evet",
          special_emlak: fourthStep.special_emlak?.value === "Evet",
          onweb_emlak: fourthStep.onweb_emlak?.value === "Evet",
        },
        thoughts: content || "",
        adminNote: fourthStep.adminNote || "",
        whoseKey: fourthStep.key?.value || "Yenigün Emlak",
        fee: formattedFee,
        address: {
          province: fourthStep.province || "",
          district: fourthStep.district || "",
          quarter: fourthStep.quarter || "",
          full_address: fourthStep.address || "",
          mapCoordinates: marker && marker[0] ? marker[0].lat : 0,
          parcel: fourthStep.parsel || "",
        },
        active: isActiveAd,
        details: {
          roomCount: fourthStep.roomCount || null,
          netArea: Number(fourthStep.netArea) || null,
          grossArea: Number(fourthStep.grossArea) || null,
          buildingAge: Number(fourthStep.buildingAge) || null,
          elevator: fourthStep.elevator?.value === "Evet",
          inSite: fourthStep.inSite?.value === "Evet",
          whichSide: fourthStep.whichSide?.value || "",
          acre: fourthStep.acre ? `${fourthStep.acre} m²` : null,
          zoningStatus: fourthStep.zoningStatus?.value || "",
          floor: Number(fourthStep.floor) || null,
          totalFloor: Number(fourthStep.totalFloor) || null,
          balcony: fourthStep.balcony?.value === "Evet",
          balconyCount: Number(fourthStep.balconyCount) || null,
          furniture: fourthStep.isFurnished?.value === "Evet",
          heating: fourthStep.heating?.value || "",
          deed: fourthStep.deedStatus?.value || "",
        },
      };

      if (selectedCategory?._id) {
        requestData.category = selectedCategory._id;
      }

      if (selectedSubcategory?._id) {
        requestData.subcategory = selectedSubcategory._id;
      }

      if (Object.keys(featureValues).length > 0) {
        requestData.features = featureValues;
      }

      console.log(
        "🚀 Güncelleme verisi:",
        JSON.stringify(requestData, null, 2)
      );

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/update-advert`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Güncelleme yanıtı:", res.data);

      await handleFileUpdates();

      toast.success("✅ İlan başarıyla güncellendi!");

      setTimeout(() => {
        router.push("/admin/emlak");
      }, 2000);
    } catch (err: any) {
      console.error("❌ İlan güncelleme hatası:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpdates = async () => {
    let uploadSuccess = true;

    if (images && images.length > 0) {
      try {
        const imageToast = toast.loading("İlan Resimleri Güncelleniyor...");
        const formData = new FormData();
        formData.append("uid", advertUid);

        images.forEach((image: any) => {
          if (image.src && image.src instanceof File) {
            formData.append("images", image.src);
          }
        });

        console.log("📤 Güncelleme FormData içeriği:");
        const formDataArray = Array.from(formData.entries());
        formDataArray.forEach((pair) => {
          console.log(pair[0] + ": ", pair[1]);
        });

        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/update-advert-images`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );

        toast.dismiss(imageToast);
        toast.success("✅ Resimler başarıyla güncellendi!");
      } catch (error: any) {
        console.error("❌ Resim güncelleme hatası:", error);
        console.error("❌ Hata detayı:", error.response?.data);
        uploadSuccess = false;
        toast.warning("İlan güncellendi ancak resimler yüklenemedi");
      }
    }

    if (videoFile && videoFile instanceof File) {
      try {
        const videoToast = toast.loading("İlan Videosu Güncelleniyor...");
        const videoForm = new FormData();
        videoForm.append("uid", advertUid);
        videoForm.append("video", videoFile);

        console.log("📤 Video güncelleme bilgisi:", {
          fileName: videoFile.name,
          fileSize: videoFile.size,
          fileType: videoFile.type,
        });

        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/update-advert-video`,
          videoForm,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );

        toast.dismiss(videoToast);
        toast.success("✅ Video başarıyla güncellendi!");
      } catch (error: any) {
        console.error("❌ Video güncelleme hatası:", error);
        console.error("❌ Video hata detayı:", error.response?.data);
        uploadSuccess = false;
        toast.warning("İlan güncellendi ancak video yüklenemedi");
      }
    }

    return uploadSuccess;
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabContainerRef.current) {
      const scrollAmount = 200;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;

      tabContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <PropertyTypeTab
            firstStep={firstStep}
            setFirstStep={setFirstStep}
            onNext={() => setActiveTab(2)}
          />
        );
      case 2:
        return (
          <ListingTypeTab
            firstStep={firstStep}
            secondStep={secondStep}
            setSecondStep={setSecondStep}
            onBack={() => setActiveTab(1)}
            onNext={() => setActiveTab(3)}
          />
        );
      case 3:
        return (
          <CategoryTab
            firstStep={firstStep}
            secondStep={secondStep}
            thirdStep={thirdStep}
            setThirdStep={setThirdStep}
            onBack={() => setActiveTab(2)}
            onNext={() => setActiveTab(4)}
          />
        );
      case 4:
        return (
          <BasicInfoTab
            fourthStep={fourthStep}
            content={content}
            setContent={setContent}
            onTitleChange={handleTitleChange}
            onPriceValueChange={handlePriceValueChange}
            onPriceTypeChange={handlePriceTypeChange}
            onAdminNoteChange={handleAdminNoteChange}
            currencyOptions={currencyOptions}
          />
        );
      case 5:
        return (
          <MediaTab
            images={images}
            setImages={setImages}
            videoFile={videoFile}
            setVideoFile={setVideoFile}
            reOrderImages={reOrderImages}
            setReOrderImages={setReOrderImages}
            onImageChange={handleImageChange}
            onVideoChange={handleVideoChange}
            onRemoveImage={handleRemoveImage}
          />
        );
      case 6:
        return (
          <LocationTab
            fourthStep={fourthStep}
            marker={marker}
            setMarker={setMarker}
            onProvinceChange={handleProvinceChange}
            onDistrictChange={handleDistrictChange}
            onQuarterChange={handleQuarterChange}
            onAddressChange={handleAddressChange}
            onParselChange={handleParselChange}
            turkeyCities={turkeyCities}
          />
        );
      case 7:
        return (
          <DetailsTab
            fourthStep={fourthStep}
            firstStep={firstStep}
            onRoomCountChange={handleRoomCountChange}
            onFloorChange={handleFloorChange}
            onTotalFloorChange={handleTotalFloorChange}
            onBuildingAgeChange={handleBuildingAgeChange}
            onNetAreaChange={handleNetAreaChange}
            onGrossAreaChange={handleGrossAreaChange}
            onBalconyCountChange={handleBalconyCountChange}
            onAcreChange={handleAcreChange}
          />
        );
      case 8:
        return (
          <FeaturesTab
            fourthStep={fourthStep}
            firstStep={firstStep}
            secondStep={secondStep}
            onElevatorToggle={handleElevatorToggle}
            onInSiteToggle={handleInSiteToggle}
            onBalconyToggle={handleBalconyToggle}
            onIsFurnishedToggle={handleIsFurnishedToggle}
            onHeatingChange={handleHeatingChange}
            onDeedStatusChange={handleDeedStatusChange}
            onWhichSideChange={handleWhichSideChange}
            onZoningStatusChange={handleZoningStatusChange}
            heatingOptions={heatingOptions}
            deedStatusOptions={deedStatusOptions}
            directionOptions={directionOptions}
            zoningStatusOptions={zoningStatusOptions}
          />
        );
      case 9:
        return (
          <OtherInfoTab
            fourthStep={fourthStep}
            customers={customers}
            advisors={advisors}
            isActiveAd={isActiveAd}
            setIsActiveAd={setIsActiveAd}
            onCustomerChange={handleCustomerChange}
            onAdvisorChange={handleAdvisorChange}
            onContractNoChange={handleContractNoChange}
            onContractDateChange={handleContractDateChange}
            onContractTimeChange={handleContractTimeChange}
            onEidsValueChange={handleEidsValueChange}
            onEidsNoChange={handleEidsNoChange}
            onEidsDateChange={handleEidsDateChange}
            onKeyChange={handleKeyChange}
            onAdvisorProfileToggle={handleAdvisorProfileToggle}
            onAgendaEmlakToggle={handleAgendaEmlakToggle}
            onHomepageEmlakToggle={handleHomepageEmlakToggle}
            onNewEmlakToggle={handleNewEmlakToggle}
            onChanceEmlakToggle={handleChanceEmlakToggle}
            onSpecialEmlakToggle={handleSpecialEmlakToggle}
            onOnwebEmlakToggle={handleOnwebEmlakToggle}
            contractTimes={contractTimes}
            yesNoOptions={yesNoOptions}
            keyOptions={keyOptions}
          />
        );
      case 10:
        return (
          <CategorySelection
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            featureValues={featureValues}
            onCategorySelect={handleCategorySelect}
            onSubcategorySelect={handleSubcategorySelect}
            onFeatureChange={handleFeatureChange}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">İlan verileri yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        className="min-h-screen bg-gray-50 p-4 lg:p-6"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <Edit className="text-blue-500" size={24} />
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                    İlanı Düzenle
                  </h1>
                </div>
                <p className="text-gray-600 text-sm lg:text-base truncate">
                  {firstStep.selected.value &&
                  secondStep.selected.value &&
                  thirdStep.selected.value
                    ? `${firstStep.selected.value} • ${secondStep.selected.value} • ${thirdStep.selected.value}`
                    : "İlan bilgilerini düzenleyin"}
                </p>
              </div>
              <Link
                href="/admin/emlak"
                className="bg-custom-orange text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit shrink-0"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Emlaklara Dön</span>
                <span className="sm:hidden">Geri</span>
              </Link>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Progress Bar */}
              <div className="bg-gray-100 h-1.5 w-full">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(activeTab / tabs.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="p-4 lg:p-6">
                {/* Enhanced Tab Navigation */}
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <div className="relative">
                    {/* Scroll Buttons */}
                    <button
                      onClick={() => scrollTabs("left")}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all duration-200"
                      disabled={scrollPosition === 0}
                    >
                      <ChevronLeft size={16} className="text-gray-600" />
                    </button>

                    <button
                      onClick={() => scrollTabs("right")}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <ChevronRight size={16} className="text-gray-600" />
                    </button>

                    <div
                      ref={tabContainerRef}
                      className="flex overflow-x-auto pb-2 -mb-2 scrollbar-hide mx-8"
                      onScroll={(e) =>
                        setScrollPosition(e.currentTarget.scrollLeft)
                      }
                    >
                      <div className="flex space-x-1 min-w-max">
                        {tabs.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;

                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveTab(tab.id)}
                              className={`
                                group flex items-center gap-2 pb-3 px-3 font-medium text-xs lg:text-sm border-b-2 
                                transition-all duration-200 whitespace-nowrap relative shrink-0
                                min-w-[100px] lg:min-w-[120px] justify-center
                                ${
                                  isActive
                                    ? "border-blue-500 text-blue-600 bg-blue-50"
                                    : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                                }
                              `}
                            >
                              <div
                                className={`
                                  p-1.5 rounded-lg transition-colors shrink-0
                                  ${
                                    isActive
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                  }
                                `}
                              >
                                <Icon size={16} />
                              </div>

                              <span className="font-medium text-xs lg:text-sm text-center leading-tight">
                                {tab.label}
                              </span>

                              {isActive && (
                                <motion.div
                                  layoutId="activeTab"
                                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px] lg:min-h-[500px] max-h-[60vh] overflow-y-auto scrollbar-hide">
                  {renderTabContent()}
                </div>

                {/* Navigation Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    {fourthStep.title ? (
                      <>
                        <CheckCircle
                          size={14}
                          className="text-green-500 shrink-0"
                        />
                        <span className="font-medium text-gray-800 truncate max-w-[200px]">
                          {fourthStep.title}
                        </span>
                      </>
                    ) : (
                      "Henüz başlık girilmedi"
                    )}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      onClick={() => setActiveTab((t) => Math.max(1, t - 1))}
                      disabled={activeTab === 1}
                      whileHover={{ scale: activeTab === 1 ? 1 : 1.02 }}
                      whileTap={{ scale: activeTab === 1 ? 1 : 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-400 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-gray-700"
                    >
                      <ArrowLeft size={16} />
                      Geri
                    </motion.button>

                    {activeTab < tabs.length ? (
                      <motion.button
                        type="button"
                        onClick={() =>
                          setActiveTab((t) => Math.min(tabs.length, t + 1))
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-semibold"
                      >
                        İleri
                        <ArrowRight size={16} />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all duration-200 font-semibold"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Güncelleniyor...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} />
                            İlanı Güncelle
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </div>

        {/* Reorder Images Modal */}
        <AnimatePresence>
          {reOrderImages && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40"
                onClick={() => setReOrderImages(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-4 w-[95vw] max-w-2xl max-h-[80vh] p-4 bg-white rounded-lg shadow-lg fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Resim Sıralama ({images.length} Adet)
                  </h2>
                  <button
                    onClick={() => setReOrderImages(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Fotoğrafları sıralamak için sürükleyip bırakabilirsiniz
                </p>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                    {images.map((image: any, index: number) => (
                      <motion.div
                        key={image.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-gray-600">
                            {index + 1}
                          </span>
                        </div>
                        <img
                          src={URL.createObjectURL(image.src)}
                          alt={image.id}
                          className="w-16 h-12 object-cover rounded shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {image.src.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(image.src.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleRemoveImage(image.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="p-1.5 text-gray-400 cursor-grab">
                            <Move size={14} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setReOrderImages(false)}
                  className="bg-custom-orange text-white py-2.5 rounded-lg font-medium hover:bg-custom-orange-dark transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Sıralamayı Tamamla
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
