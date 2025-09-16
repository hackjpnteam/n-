export default function MembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export const metadata = {
  title: '会員一覧 | Knowledge Platform',
  description: 'コミュニティメンバーの一覧'
}