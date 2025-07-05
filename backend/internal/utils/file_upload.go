package utils

import (
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"
)

// SaveUploadedFile 保存上传的文件
func SaveUploadedFile(file *multipart.FileHeader, destDirectory string) (string, error) {
	// 确保目标目录存在
	if err := os.MkdirAll(destDirectory, os.ModePerm); err != nil {
		return "", err
	}

	// 生成唯一文件名
	ext := filepath.Ext(file.Filename)
	filename := time.Now().Format("20060102150405") + ext
	destPath := filepath.Join(destDirectory, filename)

	// 打开源文件
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// 创建目标文件
	out, err := os.Create(destPath)
	if err != nil {
		return "", err
	}
	defer out.Close()

	// 复制文件内容
	if _, err = io.Copy(out, src); err != nil {
		return "", err
	}

	return destPath, nil
}
