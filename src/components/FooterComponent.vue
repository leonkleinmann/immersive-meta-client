<template>
  <div class="footer">
    <div class="wrapper">
      <div class="links">
        <div class="link">
          <a alt="hsrm" href="https://hs-rm.de">
            <IsometricWrapper>
              <img alt="hsrm" src="https://via.placeholder.com/50" />
            </IsometricWrapper>
          </a>
        </div>
        <div class="link">
          <a alt="suv" href="https://s-v.de">
            <IsometricWrapper>
              <img alt="hsrm" src="https://via.placeholder.com/50" />
            </IsometricWrapper>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IsometricWrapper from "@/components/IsometricWrapper";
export default {
  name: "FooterComponent",
  components: { IsometricWrapper }
}
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100px;
  padding-right: 20px;

  .wrapper {
    position: relative;
    height: 100%;

    .links {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      display: flex;
      flex-direction: row;
      justify-content: right;
      width: 100%;
      height: 50px;
      gap: 20px;
      padding-right: 10px;


      .link {
        width: 50px;
        height: 50px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>