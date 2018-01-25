import api from "../../utility/api";

export default {
  data() {
    return {
      config: null,
    }
  },
  async mounted() {
    await this.getConfig();
  },
  methods: {
    async getConfig() {
      this.config = await api.getConfig();
    },

    async updateConfig(param) {
      await api.updateConfig(param);
      await this.getConfig();
    }
  }
}
