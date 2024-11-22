import { Button } from "@/components/ui/button"
import { formatAddress } from "@/lib/utils"
import { ConnectButton as RainbowkitConnectButton } from "@rainbow-me/rainbowkit"
import { Loader2 } from "lucide-react"
export const ConnectButton = ({ label, showBalance }) => {
  return (
    <RainbowkitConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!ready) {
          return (
            <Button disabled>
              <Loader2 className="animate-spin" />
            </Button>
          )
        }
        return (
          <div>
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="default"
                    onClick={openConnectModal}
                    type="button"
                    className="h-12 w-full border-none bg-gary-pink text-xl font-bold outline-none hover:bg-gary-pink/80 dark:hover:bg-gary-pink/80"
                  >
                    {label}
                  </Button>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                )
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    variant="outline"
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                    className="text-[#FFAE17]"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} style={{ width: 12, height: 12 }} />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>
                  <Button variant="outline" onClick={openAccountModal} type="button" className="w-full text-[#FFAE17]">
                    {formatAddress(account.address, 12)}
                    {showBalance ? ` (${account.displayBalance})` : ""}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </RainbowkitConnectButton.Custom>
  )
}
