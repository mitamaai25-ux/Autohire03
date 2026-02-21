export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-8">
        <div className="flex justify-center items-center">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Autohire. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
