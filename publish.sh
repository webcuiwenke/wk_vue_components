#!/bin/bash

# 设置 npm 镜像地址
npm_registry="https://registry.npmjs.org"
npm_mirror="https://registry.npmmirror.com"

# 登录 npm
npm login

# 检查登录状态
npm_whoami=$(npm whoami)
if [ $? -eq 0 ]; then
  echo "Logged in as $npm_whoami"
else
  echo "Failed to login. Please check your credentials and try again."
  exit 1
fi

# 执行 npm 发布
publish_package() {
  npm publish $1
}

# 检查是否有参数传入
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <path_to_package>"
  exit 1
fi

# 检查发布目录是否存在
if [ ! -d "$1" ]; then
  echo "Directory $1 not found."
  exit 1
fi

# 切换至发布目录
cd $1

# 发布包
publish_package .

# 检查发布结果
if [ $? -eq 0 ]; then
  echo "Package published successfully."
else
  echo "Failed to publish package."
  # 尝试升级版本号
  npm version patch
  # 再次尝试发布
  publish_package .
  if [ $? -eq 0 ]; then
    echo "Package published successfully after version upgrade."
  else
    echo "Failed to publish package even after version upgrade."
  fi
fi

# 恢复 npm 镜像地址
npm config set registry $npm_mirror
