bash -c "$(curl -fsSL https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)"
npm install -g pnpm
SHELL=bash pnpm setup
source /root/.bashrc
pnpm install
