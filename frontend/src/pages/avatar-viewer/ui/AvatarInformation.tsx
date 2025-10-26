import type { Avatar } from "@/shared"
import { t } from "i18next"

export const AvatarInformation = ({ avatar }: { avatar: Avatar }) => {
    return (
        <div className="mb-8 bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {t('pages.avatarViewer.avatarInfo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-foreground">{t('pages.avatarViewer.avatarId')}:</strong>
                <p className="text-muted-foreground font-mono break-all">{avatar.id}</p>
              </div>
              <div>
                <strong className="text-foreground">{t('pages.avatarViewer.createdAt')}:</strong>
                <p className="text-muted-foreground">
                  {new Date(avatar.createdAt).toLocaleString()}
                </p>
              </div>
              {avatar.primaryColor && (
                <div>
                  <strong className="text-foreground">
                    {t('pages.avatarViewer.primaryColor')}:
                  </strong>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: avatar.primaryColor }}
                    />
                    <span className="text-muted-foreground font-mono">{avatar.primaryColor}</span>
                  </div>
                </div>
              )}
              {avatar.foreignColor && (
                <div>
                  <strong className="text-foreground">
                    {t('pages.avatarViewer.foreignColor')}:
                  </strong>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: avatar.foreignColor }}
                    />
                    <span className="text-muted-foreground font-mono">{avatar.foreignColor}</span>
                  </div>
                </div>
              )}
              {avatar.colorScheme && (
                <div>
                  <strong className="text-foreground">
                    {t('pages.avatarViewer.colorScheme')}:
                  </strong>
                  <p className="text-muted-foreground capitalize">{avatar.colorScheme}</p>
                </div>
              )}
              {avatar.seed && (
                <div>
                  <strong className="text-foreground">{t('pages.avatarViewer.seed')}:</strong>
                  <p className="text-muted-foreground font-mono">{avatar.seed}</p>
                </div>
              )}
            </div>
        </div>
    )
}