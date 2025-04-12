
import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BlogPagination = ({ currentPage, totalPages, onPageChange }: BlogPaginationProps) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="mt-12 flex justify-center">
      <div className="bg-crypto-darkGray rounded-xl p-4 border border-white/10 flex items-center shadow-lg">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.max(1, currentPage - 1));
                }}
                className="font-medium bg-crypto-darkBlue hover:bg-crypto-orange/20 border border-crypto-orange/30 text-crypto-orange hover:text-white transition-colors duration-300 flex flex-row-reverse"
              >
                <span>السابق</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </PaginationPrevious>
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === index + 1} 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(index + 1);
                  }}
                  className={`font-medium transition-colors duration-300 ${
                    currentPage === index + 1 
                      ? 'bg-crypto-orange text-white border-crypto-orange' 
                      : 'bg-transparent text-white hover:bg-crypto-orange/20 border border-crypto-orange/30'
                  }`}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.min(totalPages, currentPage + 1));
                }}
                className="font-medium bg-crypto-darkBlue hover:bg-crypto-orange/20 border border-crypto-orange/30 text-crypto-orange hover:text-white transition-colors duration-300"
              >
                <span>التالي</span>
                <ArrowLeft className="h-4 w-4 mr-2 rtl-flip" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default BlogPagination;
