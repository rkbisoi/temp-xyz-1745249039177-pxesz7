interface CardProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export function Card({ children, className = '' }: CardProps) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ children, className = '' }: CardProps) {
    return (
      <div className={`p-4 pb-0 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardTitle({ children, className = '' }: CardProps) {
    return (
      <h3 className={`text-lg font-medium ${className}`}>
        {children}
      </h3>
    );
  }
  
  export function CardContent({ children, className = '' }: CardProps) {
    return (
      <div className={`p-4 ${className}`}>
        {children}
      </div>
    );
  }