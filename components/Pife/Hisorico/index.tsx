"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { PIFEType } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Dumbbell,
  ExternalLink,
  Filter,
  Heart,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CheckinData {
  id: string;
  date: string;
  pife: PIFEType;
  note: string;
  image: string | null;
  link: string | null;
  points: number;
  validated: boolean;
  likes: number;
  comments: number;
}

interface StatsData {
  total: number;
  thisMonth: number;
  byCategory: {
    P: number;
    I: number;
    F: number;
    E: number;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  data: CheckinData[];
  stats: StatsData;
  pagination: PaginationData;
}

interface HistoricoPIFEPageProps {
  initialData?: ApiResponse;
}

const PIFE_CONFIG = {
  P: {
    label: "Profissional",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Briefcase,
  },
  I: {
    label: "Intelectual",
    color: "bg-green-500",
    textColor: "text-green-500",
    bgLight: "bg-green-50",
    borderColor: "border-green-200",
    icon: BookOpen,
  },
  F: {
    label: "Físico",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    bgLight: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: Dumbbell,
  },
  E: {
    label: "Emocional",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    bgLight: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: Heart,
  },
};

// Fetch function
async function fetchCheckins(
  page: number,
  pifeFilter: PIFEType | "Todos"
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
  });

  if (pifeFilter !== "Todos") {
    params.append("pife", pifeFilter);
  }

  const response = await fetch(`/api/v4/pife?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar check-ins");
  }

  return response.json();
}

export default function HistoricoPIFEPage({
  initialData,
}: HistoricoPIFEPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<PIFEType | "Todos">(
    "Todos"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCheckin, setSelectedCheckin] = useState<CheckinData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // React Query
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["checkins", currentPage, selectedFilter],
    queryFn: () => fetchCheckins(currentPage, selectedFilter),
    initialData:
      initialData && currentPage === 1 && selectedFilter === "Todos"
        ? initialData
        : undefined,
  });

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: PIFEType | "Todos") => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  // Open modal with checkin details
  const handleOpenModal = (checkin: CheckinData) => {
    setSelectedCheckin(checkin);
    setIsModalOpen(true);
  };

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl font-bold">Histórico</h1>
          </div>
          <p className="text-muted-foreground">Todos os seus check-ins PIFE</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-500">
                Erro ao carregar dados: {error?.message}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl font-bold">Histórico</h1>
          </div>
          <p className="text-muted-foreground">Todos os seus check-ins PIFE</p>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = data?.stats;
  const checkins = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold">Histórico</h1>
          {isFetching && (
            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
          )}
        </div>
        <p className="text-muted-foreground">Todos os seus check-ins PIFE</p>
      </div>

      {/* Statistics Cards */}
      <div className="space-y-4 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mb-6 gap-4">
        {/* Total Check-ins */}
        <Card className="h-full">
          <CardContent className="h-full flex items-center justify-between w-full">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total de Check-ins
                </p>
                <p className="text-4xl font-bold text-orange-500">
                  {stats?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month */}
        <Card className="h-full">
          <CardContent className="h-full flex items-center justify-between w-full">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Este Mês</p>
                <p className="text-4xl font-bold text-blue-500">
                  {stats?.thisMonth || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="col-span-full lg:col-span-1">
          <CardContent className="">
            <div className="grid lg:grid-cols-2 grid-cols-4 gap-4">
              <div className="text-center flex  items-center justify-center gap-2">
                <p className="text-4xl font-bold text-blue-500">P</p>
                <p className="text-4xl text-muted-foreground">
                  {stats?.byCategory.P || 0}
                </p>
              </div>
              <div className="text-center flex  items-center justify-center gap-2">
                <p className="text-4xl font-bold text-green-500">I</p>
                <p className="text-4xl text-muted-foreground">
                  {" "}
                  {stats?.byCategory.I || 0}
                </p>
              </div>
              <div className="text-center flex  items-center justify-center gap-2">
                <p className="text-4xl font-bold text-orange-500">F</p>
                <p className="text-4xl text-muted-foreground">
                  {stats?.byCategory.F || 0}
                </p>
              </div>
              <div className="text-center flex  items-center justify-center gap-2">
                <p className="text-4xl font-bold text-purple-500">E</p>
                <p className="text-4xl text-muted-foreground">
                  {stats?.byCategory.E || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-between w-full">
            <div className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4 text-orange-500" />
              Filtrar por Categoria
            </div>
            <div className="flex items-center gap-2">
              {(Object.keys(PIFE_CONFIG) as PIFEType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedFilter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(type)}
                >
                  {type}
                </Button>
              ))}
              <Button
                variant={selectedFilter === "Todos" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("Todos")}
                className={
                  selectedFilter === "Todos"
                    ? "bg-black text-white hover:bg-black/90"
                    : ""
                }
              >
                Todos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-ins List or Empty State */}
      <Card className="border-none md:border md:shadow-md shadow-none">
        <CardContent className="md:pt-6 pt-0 px-0 md:px-6">
          {checkins.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum check-in ainda. Faça seu primeiro check-in!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 ">
                {checkins.map((checkin) => {
                  const config = PIFE_CONFIG[checkin.pife];
                  const IconComponent = config.icon;
                  const hasImage = !!checkin.image;
                  const hasLink = !!checkin.link;
                  const hasDetails = hasImage || hasLink;

                  return (
                    <div
                      key={checkin.id}
                      className={`p-4 rounded-lg border bg-muted/50 dark:bg-muted/50 ${
                        hasDetails
                          ? "cursor-pointer hover:shadow-md transition-shadow"
                          : ""
                      }`}
                      onClick={() => hasDetails && handleOpenModal(checkin)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center text-white flex-shrink-0`}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">
                              {config.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(new Date(checkin.date))}
                            </p>
                          </div>
                          {hasImage && checkin.image && (
                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border">
                              <Image
                                src={checkin.image}
                                alt="Check-in"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {hasLink && (
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                          )}
                          {checkin.validated && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <Badge variant="secondary" className="text-xs">
                            +{checkin.points}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm">{checkin.note}</p>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal for Image/Link Details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          {selectedCheckin && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      PIFE_CONFIG[selectedCheckin.pife].color
                    } flex items-center justify-center text-white`}
                  >
                    {(() => {
                      const IconComponent =
                        PIFE_CONFIG[selectedCheckin.pife].icon;
                      return <IconComponent className="h-4 w-4" />;
                    })()}
                  </div>
                  {PIFE_CONFIG[selectedCheckin.pife].label}
                </DialogTitle>
                <DialogDescription>
                  {formatDate(new Date(selectedCheckin.date))}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Descrição:
                  </p>
                  <p className="text-base">{selectedCheckin.note}</p>
                </div>

                {/* Image */}
                {selectedCheckin.image && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Imagem do Check-in:
                    </p>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted/30">
                      <Image
                        src={selectedCheckin.image}
                        alt="Check-in"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                )}

                {/* Link */}
                {selectedCheckin.link && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Link relacionado:
                    </p>
                    <a
                      href={selectedCheckin.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 underline text-sm break-all"
                    >
                      {selectedCheckin.link}
                    </a>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Badge variant="secondary" className="text-sm">
                    +{selectedCheckin.points} pontos
                  </Badge>
                  {selectedCheckin.validated && (
                    <div className="flex items-center gap-1 text-sm text-green-500">
                      <CheckCircle className="h-4 w-4" />
                      Validado
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
