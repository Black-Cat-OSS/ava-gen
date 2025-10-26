import { Button } from "@/shared/ui";
import { Link } from "@tanstack/react-router";
import { t } from "i18next";

export const NotFound = () => {
  return (
    <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">{t('pages.avatarViewer.avatarNotFound')}</p>
        <Link to="/">
            <Button variant="outline">{t('pages.avatarViewer.backToGallery')}</Button>
        </Link>
    </div>
  );
};