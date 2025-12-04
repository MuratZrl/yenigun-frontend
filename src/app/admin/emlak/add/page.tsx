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
  ChevronRight,
  Move,
  ChevronLeft,
} from "lucide-react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JSONDATA from "@/app/data.json";

import {
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
import { type FormData, StepState, ImageItem } from "@/app/types/property";
import api from "@/app/lib/api";
import AdminLayout from "@/app/components/layout/AdminLayout";
import Customer from "@/app/types/customers";
import { Advisor } from "@/app/types/advert";

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

export default function AddE() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reOrderImages, setReOrderImages] = useState(false);
  const [marker, setMarker] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [isActiveAd, setIsActiveAd] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

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
        toast.error("Kategoriler yüklenemedi");
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const [firstStep, setFirstStep] = useState<StepState>({
    selected: {
      isSelect: false,
      value: "",
      id: "",
      name: "",
      categoryData: undefined,
    },
  });

  const [secondStep, setSecondStep] = useState<StepState>({
    selected: {
      isSelect: false,
      value: "",
      id: "",
      subcategoryData: undefined,
    },
  });

  const [thirdStep, setThirdStep] = useState<StepState>({
    selected: {
      isSelect: false,
      value: "",
      id: "",
      subcategoryData: undefined,
    },
  });
  const [featuresStep, setFeaturesStep] = useState<StepState>({
    selected: {
      isSelect: false,
      value: "",
      featureData: null,
    },
    selections: {},
  });

  const [fourthStep, setFourthStep] = useState<FormData>(defaultFormData);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 1, label: "Emlak Türü", icon: Home },
    { id: 2, label: "İlan Tipi", icon: FileText },
    { id: 3, label: "Kategori", icon: Building },
    { id: 4, label: "Temel Bilgiler", icon: Settings },
    { id: 5, label: "Medya", icon: Camera },
    { id: 6, label: "Konum", icon: MapPin },
    { id: 7, label: "Özellikler", icon: Star },
    { id: 8, label: "Diğer", icon: Users },
  ];

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchAllCustomers = async (): Promise<Customer[]> => {
          let allCustomers: Customer[] = [];
          let currentPage = 1;
          const limit = 100;

          while (true) {
            const response = await api.get(
              `/admin/customers?page=${currentPage}&limit=${limit}`
            );
            const customersData: Customer[] =
              response.data.data || response.data;

            if (!customersData || customersData.length === 0) {
              break;
            }

            allCustomers = [...allCustomers, ...customersData];
            currentPage++;

            if (customersData.length < limit) {
              break;
            }
          }

          return allCustomers;
        };

        const fetchAllAdvisors = async (): Promise<Advisor[]> => {
          let allAdvisors: Advisor[] = [];
          let currentPage = 1;
          const limit = 100;

          while (true) {
            const response = await api.get(
              `/admin/users?page=${currentPage}&limit=${limit}`
            );
            const advisorsData: Advisor[] = response.data.data || response.data;

            if (!advisorsData || advisorsData.length === 0) {
              break;
            }

            allAdvisors = [...allAdvisors, ...advisorsData];
            currentPage++;

            if (advisorsData.length < limit) {
              break;
            }
          }

          return allAdvisors;
        };

        const [allCustomers, allAdvisors] = await Promise.all([
          fetchAllCustomers(),
          fetchAllAdvisors(),
        ]);

        setCustomers(allCustomers);
        setAdvisors(allAdvisors);
      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
          setTimeout(() => {
            window.location.href = "/admin/emlak";
          }, 2000);
        } else {
          toast.error("Bir hata oluştu. Lütfen sayfayı yenileyin.");
        }
      }
    };

    fetchData();
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
        updateNestedFourthStep("price", "value", formatNumber(rawValue));
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

  const handleProvinceChange = useCallback(
    (value: any) => {
      updateFourthStep("province", value.value);
    },
    [updateFourthStep]
  );

  const handleDistrictChange = useCallback(
    (value: any) => {
      updateFourthStep("district", value.value);
    },
    [updateFourthStep]
  );

  const handleQuarterChange = useCallback(
    (value: any) => {
      updateFourthStep("quarter", value.value);
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
      updateFourthStep("customer", value.value);
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

  const handleAdminNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateFourthStep("adminNote", e.target.value);
    },
    [updateFourthStep]
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
      updateFourthStep("elevator", { ...fourthStep.elevator, value });
    },
    [updateFourthStep, fourthStep.elevator]
  );

  const handleInSiteToggle = useCallback(
    (value: string) => {
      updateFourthStep("inSite", { ...fourthStep.inSite, value });
    },
    [updateFourthStep, fourthStep.inSite]
  );

  const handleBalconyToggle = useCallback(
    (value: string) => {
      updateFourthStep("balcony", { ...fourthStep.balcony, value });
    },
    [updateFourthStep, fourthStep.balcony]
  );

  const handleIsFurnishedToggle = useCallback(
    (value: string) => {
      updateFourthStep("isFurnished", { ...fourthStep.isFurnished, value });
    },
    [updateFourthStep, fourthStep.isFurnished]
  );

  const handleAdvisorProfileToggle = useCallback(
    (value: string) => {
      updateFourthStep("advisor_profile", {
        ...fourthStep.advisor_profile,
        value,
      });
    },
    [updateFourthStep, fourthStep.advisor_profile]
  );

  const handleAgendaEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep("agenda_emlak", { ...fourthStep.agenda_emlak, value });
    },
    [updateFourthStep, fourthStep.agenda_emlak]
  );

  const handleHomepageEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep("homepage_emlak", {
        ...fourthStep.homepage_emlak,
        value,
      });
    },
    [updateFourthStep, fourthStep.homepage_emlak]
  );

  const handleNewEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep("new_emlak", { ...fourthStep.new_emlak, value });
    },
    [updateFourthStep, fourthStep.new_emlak]
  );

  const handleChanceEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep("chance_emlak", { ...fourthStep.chance_emlak, value });
    },
    [updateFourthStep, fourthStep.chance_emlak]
  );

  const handleSpecialEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep("special_emlak", { ...fourthStep.special_emlak, value });
    },
    [updateFourthStep, fourthStep.special_emlak]
  );

  const handleOnwebEmlakToggle = useCallback(
    (value: string) => {
      updateFourthStep("onweb_emlak", { ...fourthStep.onweb_emlak, value });
    },
    [updateFourthStep, fourthStep.onweb_emlak]
  );

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

    const eidsDateTimestamp = fourthStep.eids?.date
      ? new Date(fourthStep.eids.date).getTime()
      : null;

    const contractDateTimestamp = fourthStep.contract_date
      ? new Date(fourthStep.contract_date).getTime()
      : Date.now();

    const formattedPrice = fourthStep.price?.value
      ? `${fourthStep.price.value} ${fourthStep.price.type}`
      : "0 TL";

    const categoryId = firstStep.selected.categoryData?._id || "";

    const subcategoryId = thirdStep.selected.subcategoryData?._id
      ? thirdStep.selected.subcategoryData._id
      : secondStep.selected.subcategoryData?._id || "";

    const formattedFeatures: {
      [key: string]: string | number | boolean | string[];
    } = {};

    if (featuresStep.selections) {
      Object.values(featuresStep.selections).forEach((selection: any) => {
        if (
          selection.featureId &&
          selection.value !== undefined &&
          selection.value !== null
        ) {
          formattedFeatures[selection.featureId] = selection.value;
        }
      });
    }

    const requestData = {
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
      eids: {
        no: fourthStep.eids?.no || "",
        date: eidsDateTimestamp,
      },
      questions: {
        agendaEmlak: fourthStep.agenda_emlak?.value === "Evet",
        homepageEmlak: fourthStep.homepage_emlak?.value === "Evet",
        new_emlak: fourthStep.new_emlak?.value === "Evet",
        chance_emlak: fourthStep.chance_emlak?.value === "Evet",
        special_emlak: fourthStep.special_emlak?.value === "Evet",
        onweb_emlak: fourthStep.onweb_emlak?.value === "Evet",
      },
      thoughts: content || " ",
      adminNote: fourthStep.adminNote || "",
      whoseKey: fourthStep.key?.value || "Yenigün Emlak",
      fee: formattedPrice,
      address: {
        province: fourthStep.province || "",
        district: fourthStep.district || "",
        quarter: fourthStep.quarter || "",
        full_address: fourthStep.address || "",
        mapCoordinates:
          marker && marker[0]
            ? {
                lat: marker[0].lat,
                lng: marker[0].lng,
              }
            : { lat: 0, lng: 0 },
        parcel: fourthStep.parsel || "",
      },
      active: isActiveAd,
      details: {
        roomCount:
          firstStep.selected.value === "Konut" ||
          firstStep.selected.value === "Bina"
            ? fourthStep.roomCount
            : null,
        netArea:
          firstStep.selected.value === "Konut" ||
          firstStep.selected.value === "Bina"
            ? Number(fourthStep.netArea)
            : null,
        grossArea:
          firstStep.selected.value === "Konut" ||
          firstStep.selected.value === "Bina"
            ? Number(fourthStep.grossArea)
            : null,
        buildingAge:
          firstStep.selected.value === "Konut" ||
          firstStep.selected.value === "Bina"
            ? Number(fourthStep.buildingAge)
            : null,
        elevator: fourthStep.elevator?.value === "Evet",
        inSite: fourthStep.inSite?.value === "Evet",
        whichSide: fourthStep.whichSide?.value || "",
        acre:
          firstStep.selected.value === "Arsa" ||
          firstStep.selected.value === "Arazi"
            ? `${fourthStep.acre} m²`
            : null,
        zoningStatus:
          firstStep.selected.value === "Arsa" ||
          firstStep.selected.value === "Arazi"
            ? fourthStep.zoningStatus?.value || ""
            : "",
        floor: Number(fourthStep.floor) || null,
        totalFloor: Number(fourthStep.totalFloor) || null,
        balcony: fourthStep.balcony?.value === "Evet",
        balconyCount: Number(fourthStep.balconyCount) || null,
        furniture: fourthStep.isFurnished?.value === "Evet",
        heating: fourthStep.heating?.value || "",
        deed:
          secondStep.selected.value === "Satılık" ||
          secondStep.selected.value === "Devren Satılık"
            ? fourthStep.deedStatus?.value || ""
            : "",
      },
      category: categoryId,
      subcategory: subcategoryId,
      features: formattedFeatures,
    };

    try {
      const res = await api.post("/admin/create-advert", requestData);

      const advertUid = res.data.data.uid;

      let uploadSuccess = true;

      if (images && images.length > 0) {
        const imageToast = toast.loading("İlan resimleri yükleniyor...");
        try {
          await uploadImages(advertUid);
          toast.success("Resimler başarıyla yüklendi!");
        } catch (error: any) {
          uploadSuccess = false;
          toast.warning("İlan oluşturuldu ancak resimler yüklenemedi");
        } finally {
          toast.dismiss(imageToast);
        }
      }

      if (videoFile && videoFile instanceof File) {
        const videoToast = toast.loading("İlan videosu yükleniyor...");
        try {
          await uploadVideo(advertUid);
          toast.success("Video başarıyla yüklendi!");
        } catch (error: any) {
          uploadSuccess = false;
          toast.warning("İlan oluşturuldu ancak video yüklenemedi");
        } finally {
          toast.dismiss(videoToast);
        }
      }

      if (uploadSuccess) {
        toast.success("✅ İlan ve tüm dosyalar başarıyla oluşturuldu!");
      } else {
        toast.success("✅ İlan oluşturuldu! (Bazı dosyalar yüklenemedi)");
      }

      setTimeout(() => {
        router.push("/admin/emlak");
      }, 2000);
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error("Müşteri bulunamadı. Lütfen geçerli bir müşteri seçin.");
      } else {
        toast.error(
          err.response?.data?.message ||
            "Bir hata oluştu. Lütfen girdiğiniz bilgileri kontrol edin."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadImages = async (uid: string) => {
    try {
      const formData = new FormData();
      formData.append("uid", uid.toString());

      console.log("📤 Yüklenen resimler:");
      images.forEach((image: any, index: number) => {
        if (image.src && image.src instanceof File) {
          formData.append("images", image.src);
          console.log(`Resim ${index + 1}:`, {
            name: image.src.name,
            type: image.src.type,
            size: image.src.size,
            lastModified: image.src.lastModified,
          });
        } else {
          console.log(`Resim ${index + 1}: Geçersiz dosya`, image);
        }
      });

      console.log("📦 FormData içeriği:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      const imageFiles = images.filter((img: any) => img.src instanceof File);
      if (imageFiles.length === 0) {
        console.log("⚠️ Yüklenecek resim dosyası bulunamadı");
        return;
      }

      console.log("🚀 API isteği gönderiliyor...");
      const response = await api.post("/admin/upload-advert-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Resim yükleme başarılı:", response.data);
      return response;
    } catch (error: any) {
      console.error("❌ Resim yükleme hatası:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw error;
    }
  };

  const uploadVideo = async (uid: string) => {
    try {
      const formData = new FormData();
      formData.append("uid", uid.toString());

      if (videoFile instanceof File) {
        formData.append("video", videoFile);
      }

      const formDataArray = Array.from(formData.entries());
      formDataArray.forEach((pair) => {});

      const response = await api.post("/admin/upload-advert-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error: any) {
      throw error;
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
          <FeaturesTab
            fourthStep={fourthStep}
            firstStep={firstStep}
            secondStep={secondStep}
            thirdStep={thirdStep}
            featuresStep={featuresStep}
            setFeaturesStep={setFeaturesStep}
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

      case 8:
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
      default:
        return null;
    }
  };

  const renderContent = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 h-1.5 w-full">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${(activeTab / tabs.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="p-4 lg:p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="relative">
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
              onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
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
                      transition-all duration-200 whitespace-nowrap relative flex-shrink-0
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
                        p-1.5 rounded-lg transition-colors flex-shrink-0
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

        <div className="min-h-[400px] lg:min-h-[500px] ">
          {renderTabContent()}
        </div>

        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-xs text-gray-600 flex items-center gap-2">
            {fourthStep.title ? (
              <>
                <CheckCircle size={14} className="text-green-500 shrink-0" />
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
                    Yayınlanıyor...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    İlanı Yayınla
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div
        className="min-h-screen bg-gray-50 p-4 lg:p-6"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">
                  Yeni Emlak İlanı
                </h1>
                <p className="text-gray-600 text-sm lg:text-base truncate">
                  {firstStep.selected.value &&
                  secondStep.selected.value &&
                  thirdStep.selected.value
                    ? `${firstStep.selected.value} • ${secondStep.selected.value} • ${thirdStep.selected.value}`
                    : "Emlak ilanınızı oluşturun ve potansiyel alıcılara ulaştırın"}
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

          {activeTab === tabs.length ? (
            <form onSubmit={handleSubmit}>{renderContent()}</form>
          ) : (
            renderContent()
          )}
        </div>

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

                <div className="flex-1 overflow-y-auto">
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
