# detailed instructions for installing
$script = <<SCRIPT

  # update ubuntu (security etc.)
  apt-get update

  # nodejs
  sudo apt-get -y install g++ git git-core nodejs npm

  # use https://github.com/visionmedia/n to get latest node+npm
  sudo npm install n -g
  sudo n stable
  node -v

SCRIPT

Vagrant.configure("2") do |config|

  # config.vm.box = "base"
  config.vm.box = "ubuntu-nodejs-server"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

  config.vm.network :forwarded_port, guest: 4000, host: 4000
  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network :private_network, ip: "192.168.33.2"
  config.vm.provision :shell, :inline => $script

end
