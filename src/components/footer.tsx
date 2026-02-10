export function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          由{" "}
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            AI 工具导航
          </a>
          构建。源代码可在{" "}
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          上获取。
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI 工具导航。保留所有权利。
        </p>
      </div>
    </footer>
  );
}