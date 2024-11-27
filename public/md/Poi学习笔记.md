## EasyPoi

### 核心概念

## EasyExcel

### 常见问题

**1. Web应用导出报错：com.alibaba.excel.exception. ExcelGenerateException: Can not close IO.**

响应头中写入的文件名称包含某些特殊中文字符，这些字符存在编码异常导致出现该问题。

将文件名写入请求头前进行URL编码即可，例： `String fileName = URLEncoder.encode("测试文件名.xlsx", "UTF-8").replaceAll("\\+", "%20");`

或者使用了异步（导出文件后写入响应是另起线程或由其它线程完成的），主线程完成后已经返回，此时响应已经完成，输出流已被关闭，等异步线程或其它线程导出完成后再次获取已经完成的响应输出流写入响应体时就会出现该错误。

注意检查程序逻辑，避免二次获取并操作响应对象的输出流，即响应对象的输出流在一次请求的处理过程中只能被获取和输出一次
