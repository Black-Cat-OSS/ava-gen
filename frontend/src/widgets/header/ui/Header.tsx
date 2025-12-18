import { useTranslation } from 'react-i18next';
import { Button, BurgerIcon, LanguagePopup, NavigationLink } from '@/shared/ui';
import { ThemeToggle, LanguageSwitcher, LanguageButton } from '@/features';
import { MobileMenu } from '@/widgets';
import { useMobileMenu } from '@/shared/lib/contexts';

interface HeaderProps {
  className?: string;
  showLogin?: boolean;
  showLogo?: boolean;
  logoSize?: { width: number; height: number };
  brand?: string;
}

/**
 * Header component
 * @param className - The class name for the header
 * @param showLogin - Whether to show the login button
 * @param showLogo - Whether to show the logo
 * @param logoSize - The size of the logo
 * @param brand - Optional brand text
 * @returns Header component
 *
 * @description Header component
 * @example
 * <Header showLogin={true} showLogo={true} />
 * @example
 * <Header showLogin={false} showLogo={false} />
 * @example
 * <Header showLogin={true} showLogo={false} />
 * @example
 * <Header showLogin={false} showLogo={true} />
 * @example
 * <Header brand="My Brand" />
 */
export const Header = ({
  className,
  showLogin = false,
  showLogo = false,
  logoSize = { width: 10, height: 10 },
  brand,
}: HeaderProps) => {
  const { t } = useTranslation();
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu } = useMobileMenu();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-sm ${className || ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Mobile Burger Button - Hidden on desktop */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors mr-3"
                aria-label="Toggle mobile menu"
              >
                <BurgerIcon isOpen={isMobileMenuOpen} />
              </button>
              <NavigationLink
                to="/"
                className="flex items-center gap-2 text-xl font-bold text-foreground"
              >
                {showLogo && (
                  <img
                    src="/logo.svg"
                    alt="Logo"
                    className={`w-${logoSize.width} h-${logoSize.height}`}
                  />
                )}
                {brand}
              </NavigationLink>
            </div>

            {/* Mobile Controls - Hidden on desktop */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageButton />
              <ThemeToggle />
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-4">
              <NavigationLink to="/">{t('common.home')}</NavigationLink>
              <NavigationLink to="/about">{t('common.about')}</NavigationLink>
              <NavigationLink to="/avatar-generator">
                {t('pages.avatarGenerator.title')}
              </NavigationLink>
              <NavigationLink to="/avatar-viewer">{t('pages.avatarViewer.title')}</NavigationLink>
              <NavigationLink to="/palettes">{t('pages.palettes.title')}</NavigationLink>
              <LanguageSwitcher />
              <ThemeToggle />
              {showLogin && (
                <NavigationLink to="/login">
                  <Button variant="outline" size="sm">
                    {t('common.login')}
                  </Button>
                </NavigationLink>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu showLogin={showLogin} />

      {/* Language Popup */}
      <LanguagePopup />
    </>
  );
};
